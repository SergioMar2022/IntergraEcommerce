// Importar las bibliotecas y módulos necesarios

// Endpoint para solicitar la recuperación de contraseña
app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Buscar al usuario por su correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'El correo electrónico no está registrado.' });
    }

    // Generar un token único y guardarlo en el usuario
    const token = generateToken();
    user.resetPasswordToken = token;
    user.resetPasswordExpiration = Date.now() + 3600000; // 1 hora de expiración
    await user.save();

    // Enviar el correo de recuperación de contraseña
    const resetUrl = `http://example.com/reset-password/${token}`;
    await sendResetPasswordEmail(email, resetUrl);

    res.json({ message: 'Se ha enviado un correo electrónico para restablecer la contraseña.' });
  } catch (error) {
    console.error('Error al solicitar la recuperación de contraseña:', error);
    res.status(500).json({ message: 'Ocurrió un error al solicitar la recuperación de contraseña.' });
  }
});

// Endpoint para restablecer la contraseña
app.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    // Buscar al usuario por el token de restablecimiento de contraseña
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiration: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: 'El token es inválido o ha expirado.' });
    }

    // Verificar que la nueva contraseña no sea igual a la actual
    if (password === user.password) {
      return res.status(400).json({ message: 'La nueva contraseña no puede ser la misma que la actual.' });
    }

    // Actualizar la contraseña y limpiar los campos de recuperación de contraseña
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpiration = null;
    await user.save();

    res.json({ message: 'Contraseña restablecida exitosamente.' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ message: 'Ocurrió un error al restablecer la contraseña.' });
  }
});
