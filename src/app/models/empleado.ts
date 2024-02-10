export interface Empleado {
    cedula: number
    nombre: string
    fechaIngreso: string
    fotoEmpleado: string
    cargo: string
  }
  
  
  
  export type OmitirAtributpEmpleado = Omit<Empleado, 'fechaIngreso'>