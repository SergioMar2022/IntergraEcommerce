// Endpoint para cambiar el rol de un usuario
app.put('/api/users/premium/:uid', async (req, res) => {
    try {
      const { uid } = req.params;
      const { role } = req.body;
  
      // Buscar al usuario por su ID
      const user = await User.findById(uid);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
  
      // Actualizar el rol del usuario
      user.role = role;
      await user.save();
  
      res.json({ message: 'Rol de usuario actualizado exitosamente.' });
    } catch (error) {
      console.error('Error al cambiar el rol del usuario:', error);
      res.status(500).json({ message: 'Ocurrió un error al cambiar el rol del usuario.' });
    }
  });
  