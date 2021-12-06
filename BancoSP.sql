select * from Administrador

select * from Cuenta --información total de la cuenta

select * from Cuentahabiente

select * from Registro

select * from Tercero -- cuentas que tiene cada cuentahabiente

select * from Transaccion


create or alter procedure SPInsertUser
@usuario nvarchar(50),
@nombres nvarchar(50),
@apellidos nvarchar(50),
@FechaNacimiento nvarchar(50),
@direccion nvarchar(50),
@telefono nvarchar(15),
@contraseña nvarchar(50)
as
begin 
	declare @numCuenta nvarchar(6), @cont int, @contReg int
	set @numCuenta = '123'
	set @cont = (select COUNT(*) from Cuenta)
	set @contReg = (select COUNT(*) from Registro) + 1;

	insert into Cuentahabiente values (@usuario, @nombres, @apellidos, CAST(@FechaNacimiento as date), @direccion, @telefono, @contraseña)
	if(@cont < 10)
	begin
		set @numcuenta += '00' + CAST(@cont + 1 as nvarchar(1))
	end
	if(@cont < 100 and @cont > 10)
	begin
		set @numcuenta += '0' + CAST(@cont + 1 as nvarchar(1))
	end
	if(@cont < 1000 and @cont > 100)
	begin
		set @numcuenta += CAST(@cont + 1 as nvarchar(1))
	end

	insert into Cuenta values (@numCuenta, @usuario, 'Monetaria', 1000.00, 1)
	insert into Registro values (@contReg, 'admin', @usuario, 'Crear', 1000.00, GETDATE()) 
end;


create or alter procedure SPCreditAccount
@NumeroCuenta nvarchar(15),
@monto nvarchar(20)
as
begin
	declare @usuario nvarchar(20), @contRegistro int, @contTran int , @saldo money 
	set @usuario = (select Cuentahabiente from Cuenta where [No. Cuenta] = CAST(@NumeroCuenta as int))
	set @contRegistro = (select COUNT(*) from Registro) + 1;
	set @contTran = (select COUNT(*) from Transaccion) + 1;
	set @saldo = TRY_CONVERT(money, @monto) + (select Saldo from Cuenta where [No. Cuenta] = CAST(@NumeroCuenta as int))

	-- inserta en el historial del admin
	insert into Registro values	(@contRegistro, 'admin', @usuario, 'Crédito',TRY_CONVERT(money, @monto), GETDATE())
	-- inserta la transacción
	--insert into Transaccion values ('admin', @usuario, TRY_CONVERT(money, @monto), 'C', GETDATE())
	-- actualiza datos de la cuenta
	update Cuenta set Saldo = @saldo where [No. Cuenta] = CAST(@NumeroCuenta as int)
end;


exec SPCreditAccount '123003', '123.00'

exec SPInsertUser 'Ana', 'Ana Karina', 'Ortiz Fuentes', '2000-02-23', 'Ciudad', '38238992', 'ana123'

delete from Cuentahabiente where Usuario = 'AndreaH'
---------------


--Validar que lo tenga en contactos y en el receptor este HABILITADO
CREATE OR ALTER FUNCTION F_ValidarTercero(@emisor NVARCHAR(50), @receptor NVARCHAR(50), @cuentaR INT)
RETURNS NVARCHAR(50)
AS
BEGIN
	DECLARE @tercero NVARCHAR(50)
	DECLARE @estado BIT --El estado del tercero

	SET @tercero = (SELECT Tercero.[No. Cuenta] FROM Tercero 
	INNER JOIN Cuenta 
		ON Tercero.Cuentahabiente = Cuenta.Cuentahabiente
	WHERE Tercero.Usuario = @receptor AND Tercero.Cuentahabiente = @emisor AND Tercero.[No. Cuenta] = @cuentaR)

	SET @estado = (SELECT Cuenta.Estado FROM Tercero 
	INNER JOIN Cuenta 
		ON Tercero.Usuario = Cuenta.Cuentahabiente
	WHERE Cuenta.Cuentahabiente = @receptor AND Cuenta.[No. Cuenta] = @cuentaR )
	
	IF @estado = 0
	BEGIN
		SET @tercero = 'Disable'
	END

	RETURN ISNULL(@tercero,'NotExist')
END
GO

SELECT dbo.F_ValidarTercero('boris', 'lucas', 123457) AS CuentaATransferir
go
-----------------

--Validación de monto, si tiene la cantidad ingresada retoran 1, y si no posee la cantidad retorna 0
CREATE OR ALTER FUNCTION F_ValidarMonto(@emisor NVARCHAR(50), @cuenta INT, @monto MONEY)
RETURNS BIT
AS
BEGIN
	DECLARE @valido BIT
	IF @monto > (SELECT Saldo FROM Cuenta WHERE [No. Cuenta] = @cuenta)
	BEGIN
		SET @valido = 0
	END
	ELSE
	BEGIN
		SET @valido = 1
	END
	

	RETURN @valido
END
GO

SELECT dbo.F_ValidarMonto('boris', 123456, 900)
go
-----------------

--Update, realiza el debito en cuenta emisor y el cretido en receptor
CREATE OR ALTER PROCEDURE SPUpdateSaldos
	@emisor		INT,
	@receptor	INT,
	@monto		MONEY
AS
BEGIN
	DECLARE @anteriorE	MONEY, 
			@actualE	MONEY, 
			@anteriorR	MONEY, 
			@actualR	MONEY

	SET @anteriorE = (SELECT Saldo FROM Cuenta WHERE [No. Cuenta] = @emisor)
	SET @anteriorR = (SELECT Saldo FROM Cuenta WHERE [No. Cuenta] = @receptor)
	SET @actualE = (@anteriorE - @monto)
	SET @actualR = (@anteriorR + @monto)

	UPDATE Cuenta
	SET Saldo = @actualE
	WHERE [No. Cuenta] = @emisor

	UPDATE Cuenta
	SET Saldo = @actualR
	WHERE [No. Cuenta] = @receptor

END
GO

EXEC SPUpdateSaldos 123457, 123456, 300.00
GO

-----------------

--Trigger de insert de transacción, insertar dos registros
CREATE OR ALTER TRIGGER TRTransaccionRealizada
ON Transaccion FOR INSERT
AS
	DECLARE @emisor 	NVARCHAR(50);
	DECLARE @cuentaE	INT;
	DECLARE @receptor	NVARCHAR(50);
	DECLARE @cuentaR	INT;
	DECLARE @monto		NVARCHAR(50);
	DECLARE @fechahora	DATETIME;

	DECLARE @ValTercero	NVARCHAR(50);
	DECLARE @ValMonto	BIT;

	SELECT @cuentaE = CuentaEmisor FROM inserted
	SELECT @emisor = Cuentahabiente FROM Cuenta WHERE [No. Cuenta] = @cuentaE
	SELECT @cuentaR = CuentaReceptor FROM inserted
	SELECT @receptor = Cuentahabiente FROM Cuenta WHERE [No. Cuenta] = @cuentaR
	
	SELECT @monto = Monto FROM inserted
	SELECT @fechahora = [Fecha y hora] FROM inserted

	SET @ValTercero = (SELECT dbo.F_ValidarTercero(@emisor, @receptor, @cuentaR))

	IF (@ValTercero <> @cuentaR)
	BEGIN
		PRINT(@ValTercero)
		RETURN
	END

	SET @ValMonto = (SELECT dbo.F_ValidarMonto(@emisor, @cuentaE, @monto))

	IF (@ValMonto = 0)
	BEGIN
		PRINT('Saldo insuficiente')
		RETURN
	END

	IF ((@ValTercero = @cuentaR) AND (@ValMonto = 1))
	BEGIN
		EXEC SPUpdateSaldos @cuentaE, @cuentaR, @monto
	END

	INSERT INTO Transaccion VALUES (@cuentaE, @cuentaR, @monto, 'C', @fechahora)
	--PRINT(@emisor + @cuentaE + @receptor + @cuentaR + @monto + 'C' + @fechahora)
GO