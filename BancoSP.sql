select * from Administrador

select * from Cuenta -- listado de cuentas por usuarios

select * from Cuentahabiente -- listado de usuarios

select * from Registro -- registro de administrador

select * from Tercero -- cuentas que tiene cada cuentahabiente

select * from Transaccion -- historial de transacciones

-- Administrador
insert into Cuentahabiente values ('admin', 'admin', 'admin', GETDATE(), 'Ciudad', 00000000, '123')
insert into Cuenta values (000001, 'admin', 'admin', 10000000000, 1)

create or alter procedure SPInsertUser
@usuario nvarchar(50),
@nombres nvarchar(50),
@apellidos nvarchar(50),
@FechaNacimiento nvarchar(50),
@direccion nvarchar(50),
@telefono nvarchar(15),
@contraseņa nvarchar(50)
as
begin 
	declare @existe nvarchar(50)
	set @existe = (select Usuario from Cuentahabiente where Usuario = @usuario)

	if(@existe is null)
	begin
		declare @numCuenta nvarchar(6), @cont int, @contReg int, @contTercero int
		set @numCuenta = '123' -- codigo cuentas monetarias
		set @cont = (select COUNT(*) from Cuenta where Tipo = 'Monetaria')
		set @contReg = (select COUNT(*) from Registro) + 1;
		set @contTercero = (select COUNT(*) from Tercero) + 1;

		insert into Cuentahabiente values (@usuario, @nombres, @apellidos, CAST(@FechaNacimiento as date), @direccion, @telefono, @contraseņa)
		if(@cont < 10)
		begin
			set @numcuenta += '00' + CAST(@cont + 1 as nvarchar(1))
		end
		if(@cont < 100 and @cont >= 10)
		begin
			set @numcuenta += '0' + CAST(@cont + 2 as nvarchar(2))
		end
		if(@cont < 1000 and @cont >= 100)
		begin
			set @numcuenta += CAST(@cont + 1 as nvarchar(3))
		end

		insert into Cuenta values (@numCuenta, @usuario, 'Monetaria', 0.00, 1)
		insert into Registro values (@contReg, 'admin', @usuario, 'Crear C.M', 1000.00, GETDATE()) 
		insert into Tercero values (@contTercero, 'admin', @usuario, 'Monetaria', @numCuenta)
		insert into Tercero values (@contTercero + 1, @usuario, @usuario, 'Monetaria', @numCuenta)
		insert into Transaccion values (1, @numCuenta, '1000.00', 'C', GETDATE())
		
		select 'Mensaje' = 'Cuenta creada correctamente'
		return
	end
	else
	begin
		select 'Mensaje' = 'Error, el usuario ingresado ya existe'
		return
	end
end;

create or alter procedure SPCreditAccount
@NumeroCuenta nvarchar(15),
@monto nvarchar(50)
as
begin
	declare @usuario nvarchar(20), @contRegistro int, @contTran int , @saldo money, @estado bit
	set @usuario = (select Cuentahabiente from Cuenta where [No. Cuenta] = CAST(@NumeroCuenta as int))
	set @contRegistro = (select COUNT(*) from Registro) + 1;
	set @contTran = (select COUNT(*) from Transaccion) + 1;
	set @saldo = TRY_CONVERT(money, @monto) + (select Saldo from Cuenta where [No. Cuenta] = CAST(@NumeroCuenta as int))
	set @estado = (select Estado from Cuenta where [No. Cuenta] = CAST(@NumeroCuenta as int))

	if(@usuario is not null and @estado = 1)
	begin
		-- inserta en el historial del admin
		insert into Registro values	(@contRegistro, 'admin', @usuario, 'Crédito',TRY_CONVERT(money, @monto), GETDATE())
		-- inserta la transacción
		insert into Transaccion values (1, CAST(@NumeroCuenta as int), @monto, 'C', GETDATE())
		-- actualiza datos de la cuenta
		update Cuenta set Saldo = @saldo where [No. Cuenta] = CAST(@NumeroCuenta as int)
		select 'Mensaje' = 'Transacción realizada de manera exitosa'
		return 
	end
	else
	begin
		select 'Mensaje' = 'Número de cuenta inválido'
		return 
	end
end;


exec SPCreditAccount '123003', '1.00'

--insert into Transaccion values (1, 123003, '1.00', 'C', GETDATE())

exec SPInsertUser 'luisa', 'Luisa', 'López Fuentes', '1992-02-23', 'Ciudad', '13847562', 'luisa123'

delete from Cuentahabiente where Usuario = 'jose'
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
	WHERE Tercero.Usuario = @emisor AND Tercero.Cuentahabiente = @receptor AND Tercero.[No. Cuenta] = @cuentaR AND Cuenta.[No. Cuenta] = @cuentaR)

	SET @estado = (SELECT Cuenta.Estado FROM Tercero 
	INNER JOIN Cuenta 
		ON Tercero.Usuario = Cuenta.Cuentahabiente
	WHERE Cuenta.Cuentahabiente = @receptor AND Cuenta.[No. Cuenta] = @cuentaR and Tercero.[No. Cuenta] = @cuentaR)
	
	IF @estado = 0
	BEGIN
		SET @tercero = 'Disable'
	END

	RETURN ISNULL(@tercero,'NotExist')
END
GO
SELECT dbo.F_ValidarTercero('admin', 'sofiaK', 456015) AS CuentaATransferir
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
ON Transaccion INSTEAD OF INSERT
AS
	DECLARE @emisor 	NVARCHAR(50);
	DECLARE @cuentaE	INT;
	DECLARE @receptor	NVARCHAR(50);
	DECLARE @cuentaR	INT;
	DECLARE @monto		NVARCHAR(50);
	DECLARE @fechahora	DATETIME;

	DECLARE @ValTercero	NVARCHAR(50);
	DECLARE @ValMonto	BIT;

	SELECT @cuentaE = CuentaEmisor FROM inserted -- 1
	SELECT @emisor = Cuentahabiente FROM Cuenta WHERE [No. Cuenta] = @cuentaE -- admin
	SELECT @cuentaR = CuentaReceptor FROM inserted -- numCuenta
	SELECT @receptor = Cuentahabiente FROM Cuenta WHERE [No. Cuenta] = @cuentaR -- sofiaK
	
	SELECT @monto = Monto FROM inserted
	SELECT @fechahora = [Fecha y hora] FROM inserted
	--insert into Transaccion values (1, @numCuenta, '1000.00', 'C', GETDATE())
	
	SET @ValTercero = (SELECT dbo.F_ValidarTercero(@emisor, @receptor, @cuentaR)) -- admin, sofiaK, 123014

	IF (@ValTercero <> @cuentaR)
	BEGIN
		PRINT(@ValTercero)
		RETURN
	END 

	SET @ValMonto = (SELECT dbo.F_ValidarMonto(@emisor, @cuentaE, @monto))

	IF (@ValMonto = 0)
	BEGIN
		print 'Saldo insuficiente'
		select 'Mensaje' = 'Saldo insuficiente'
		RETURN
	END

	IF ((@ValTercero = @cuentaR) AND (@ValMonto = 1))
	BEGIN
		EXEC SPUpdateSaldos @cuentaE, @cuentaR, @monto
		INSERT INTO Transaccion VALUES (@cuentaE, @cuentaR, @monto, 'D', @fechahora)
		INSERT INTO Transaccion VALUES (@cuentaE, @cuentaR, @monto, 'C', @fechahora)
	    select 'Mensaje' = 'Transacción realizada de manera exitosa'
		RETURN
	END

	--INSERT INTO Transaccion VALUES (@cuentaE, @cuentaR, @monto, 'C', @fechahora)
	--select 'Mensaje' = 'Transacción realizada de manera exitosa'
	--PRINT(@emisor + @cuentaE + @receptor + @cuentaR + @monto + 'C' + @fechahora)
GO


-- Crear cuenta de ahorro
create or alter procedure SPCreateAccount
@NumeroCuenta nvarchar(6)
as 
begin
	-- buscar el usuario de la cuenta por numero de cuenta
	declare @usuario nvarchar(50), @cuentaAhorro nvarchar(6), @cont int, @contReg int, @tipo nvarchar(30), @estado bit, @contTercero int 
	set @usuario = (select Cuentahabiente from Cuenta where [No. Cuenta] = CAST(@NumeroCuenta as int))
	set @cuentaAhorro = '456' 
	set @cont = (select COUNT(*) from Cuenta where Tipo = 'Ahorro')
	set @contReg = (select COUNT(*) from Registro) + 1;
	set @tipo = (select Tipo from Cuenta where [No. Cuenta] = CAST(@NumeroCuenta as int))
	set @estado = (select Estado from Cuenta where [No. Cuenta] = CAST(@NumeroCuenta as int))
	set @contTercero = (select COUNT(*) from Tercero) + 1;

	if(@tipo = 'Monetaria' and @usuario is not null and @estado = 1)
	begin
		if(@cont < 10)
		begin
			set @cuentaAhorro += '00' + CAST(@cont + 1 as nvarchar(1))
		end
		if(@cont < 100 and @cont >= 10)
		begin
			set @cuentaAhorro += '0' + CAST(@cont + 1 as nvarchar(3))
		end
		if(@cont < 1000 and @cont >= 100)
		begin
			set @cuentaAhorro += CAST(@cont + 1 as nvarchar(3))
		end 
	
		-- agregar nueva cuenta en tabla CUENTA 
		insert into Cuenta values (@cuentaAhorro, @usuario, 'Ahorro', 0.00, 1)
		-- agreagar en tabla REGISTRO crear cuenta de ahorro
		insert into Registro values (@contReg, 'admin', @usuario, 'Crear C.A', 0.00, GETDATE())
		-- agregar en tercero
		insert into Tercero values (@contTercero, 'admin', @usuario, 'Ahorro', @cuentaAhorro)
		-- agregar a terceros la cuenta monetaria con la cuenta de ahorro
		insert into Tercero values (@contTercero + 1, @usuario, @usuario, 'Ahorro', @cuentaAhorro)
		select 'Mensaje' = 'Cuenta de ahorro agregada'
		return
	end 
	else
	begin
		select 'Mensaje' = 'Numero de cuenta inválido'
		return
	end
end;
exec SPCreateAccount '234543'

-- Bloquear cuenta
create or alter procedure SPBlockAccount
@NumeroCuenta nvarchar(6)
as
begin
	-- buscar el numero de cuenta
	declare @usuario nvarchar(50), @estado bit 
	set @usuario = (select Cuentahabiente from Cuenta where [No. Cuenta] = CAST(@numeroCuenta as int))
	set @estado = (select Estado from Cuenta where  [No. Cuenta] = CAST(@numeroCuenta as int))

	if(@estado = 1 and @usuario is not null)
	begin
		update Cuenta set Estado = 0 where [No. Cuenta] = @NumeroCuenta
		select 'Mensaje' = 'Cuenta ' + @NumeroCuenta + ' bloqueada exitosamente'
		return
	end 
	else
	begin
		select 'Mensaje' = 'Número de cuenta inválido'
		return
	end
end

-- transferir a cuenta
create or alter procedure SPTransferir
@origen nvarchar(6),
@destino nvarchar(6),
@monto nvarchar(6)
as
begin
	if(@origen <> @destino)
	begin
		-- insert en transacción
		insert into Transaccion values (@origen, @destino, @monto, 'D', GETDATE())
		return
	end
	else
	begin
		select 'Mensaje' = 'Error en transacción, número de cuenta inválido'
		return
	end
end

exec SPTransferir '456004', '456007', '3.00' 

-- cambiar la contraseņa
create or alter procedure SPCambiarContraseņa
@nuevaC nvarchar(50),
@usuario nvarchar(50)
as 
begin 
	declare @antiguaC nvarchar(50)
	set @antiguaC = (select Contraseņa from Cuentahabiente where Usuario = @usuario)

	if(@antiguaC <> @nuevaC)
	begin
		update Cuentahabiente set Contraseņa = @nuevaC where Usuario = @usuario
		select 'Mensaje' = 'Contraseņa actualizada'
	end
	else 
	begin
		select 'Mensaje' = 'Error, ingrese una nueva contraseņa'
	end 
end 

-- Agregar tercero
create or alter procedure SPAgregarT
@usuario nvarchar(50),
@usuarioT nvarchar(50),
@cuenta nvarchar(6)
as
begin
	declare @estado bit, @contador int, @tipo nvarchar(30)
	set @estado = (select Estado from Cuenta where Cuentahabiente = @usuarioT and [No. Cuenta] = @cuenta)
	set @contador = (select COUNT(*) from Tercero) + 1;

	if(@estado = 1)
	begin
		set @tipo = (select Tipo from Cuenta where Cuentahabiente = @usuarioT and [No. Cuenta] = @cuenta)
		insert into Tercero values (@contador, @usuario, @usuarioT, @tipo, @cuenta)
		select 'Mensaje' = 'Cuenta ' + @cuenta + ' agregada existosamente'
	end
	else 
	begin
		select 'Mensaje' = 'Error, Usuario o número de cuenta incorrectos'
	end
end

-- Eliminar tercero
create or alter procedure SPEliminarT
@usuario nvarchar(50),
@usuarioT nvarchar(50),
@cuenta nvarchar(6)
as
begin
	begin try
	declare @estado bit, @contador int, @tipo nvarchar(30), @existe nvarchar(50)
	set @estado = (select Estado from Cuenta where Cuentahabiente = @usuarioT and [No. Cuenta] = @cuenta)
	set @contador = (select COUNT(*) from Tercero) + 1;
	set @existe = (select Usuario from Tercero where Cuentahabiente = @usuarioT and [No. Cuenta] = @cuenta and Usuario = @usuario)

	if(@estado = 1 and @existe is not null)
	begin
		set @tipo = (select Tipo from Cuenta where Cuentahabiente = @usuarioT and [No. Cuenta] = @cuenta)
		delete from Tercero where Usuario = @usuario and Cuentahabiente = @usuarioT and [No. Cuenta] = @cuenta
		select 'Mensaje' = 'La cuenta ' + @cuenta + ' ha sido eliminada'
	end
	else 
	begin
		if(@existe is null and @estado = 1)
		begin
			select 'Mensaje' = 'Error, Cuenta no agregada'
			return
		end 
		select 'Mensaje' = 'Error, Usuario o número de cuenta incorrectos'
	end
	end try 
	begin catch
		select 'Mensaje' = 'Error, datos inválidos'
	end catch
end
