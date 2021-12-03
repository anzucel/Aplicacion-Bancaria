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