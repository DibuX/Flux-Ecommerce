import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { executeQuery } from "@/lib/db/mysql"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, password } = body

    // Validar que todos los campos requeridos estén presentes
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: "Faltan campos requeridos" }, { status: 400 })
    }

    // Verificar si el usuario ya existe
    const existingUsers = await executeQuery("SELECT id_usuario FROM usuarios WHERE email = ?", [email])

    if (existingUsers.length > 0) {
      return NextResponse.json({ message: "El email ya está registrado" }, { status: 409 })
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insertar el nuevo usuario
    await executeQuery(
      `INSERT INTO usuarios (nombre, apellido, email, contraseña, fecha_registro, ultimo_login, activo)
       VALUES (?, ?, ?, ?, NOW(), NOW(), 1)`,
      [firstName, lastName, email, hashedPassword],
    )

    // Responder con éxito
    return NextResponse.json({ success: true, message: "Usuario registrado correctamente" }, { status: 201 })
  } catch (error) {
    console.error("Error en registro:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
