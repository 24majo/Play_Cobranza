#### Checklist de errores

**Clientes**
- Indicar que no se puede eliminar por tener notas de venta

**Productos/Servicios**
- Límite de dígitos en precio (5 máximo)
- Indicar que no se puede eliminar por relación con registros actuales

**Sucursales**
- Límite de dígitos en campo de código postal
- Si la sucursal se elimina en la opción de la tabla, indicar que no se puede por estar asociada a un cliente
- Mínimo y máximo de digitos para teléfono
- Validación de formato de campos (Estado y Ciudad)
- No realiza la edición de datos
- Campo de texto de búsqueda dice "cliente"

**Venta**
- Ingreso de un producto/servicio que no registró abono
   - ⚠️ Nota de venta con estatus "Unknown"
   - ❌ No genera folio de abono
- Nota de venta con registro del mismo producto/servicio ingresado varias veces

**Abonos**
- Orden de vista de tabla de notas de venta
- Función de botón "Ver más"
- Ingreso de abono negativo resta en el abono total
   - ❌ No hay una alerta para el usuario si la operación se hizo o no correctamente 
   - ✅ Si se ingresó un abono negativo menor a un abono positivo, procede

**Logs de auditoría**
- Filtro "todos" no muestra datos