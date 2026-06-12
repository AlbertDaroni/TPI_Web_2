const { Imagen, Mensaje, Usuario, Etiqueta, Favorito, Validador, Comentario, Valoracion, Publicacion, Notificacion } = require('./models');

async function popular() {
    try {
        await crearUsuarios();
        await crearSeguidosYSeguidores();
        await crearPublicaciones();
        await crearImagenes();
        await crearEtiquetas();
        await crearValoraciones();
        await crearComentarios();
        await crearFavoritos();
        await crearIntereses();
        await crearDenuncias();
        await crearMensajes();
        await crearValidaciones();
        // Las notificaciones se crean al seguir, dejar de seguir, comentar,
        // denunciar, valorizar o marcar el interés por una publicación

        console.log(
            `\n` +
            `Usuarios creados: ${await Usuario.count()}\n` +
            `Publicaciones creadas: ${await Publicacion.count()}\n` +
            `Comentarios creados: ${await Comentario.count()}\n` +
            `Imágenes creadas: ${await Imagen.count()}\n` +
            `Etiquetas creadas: ${await Etiqueta.count()}\n` +
            `Mensajes creados: ${await Mensaje.count()}\n` +
            `Validaciones creadas: ${await Validador.count()}\n` +
            `Valoraciones creadas: ${await Valoracion.count()}\n` +
            `Favoritos creados: ${await Favorito.count()}\n` +
            `Notificaciones creadas: ${await Notificacion.count()}\n` +
            `Denuncias creadas: ${await Notificacion.count({ where: { tipo_evento: 'Denuncia' } })}\n`
        );
    } catch (error) { console.log(error); }
}

async function crearUsuarios() {
    try {
        const usuarios = [];

        usuarios.push(
            { nombre: 'Antonio', email: 'correodeantonio@gmail.com', contrasena: 'antonio123', registrado: true },
            { nombre: 'Ariana', email: 'correodeariana@gmail.com', contrasena: 'ariana123', registrado: true },
            { nombre: 'Axel', email: 'correodeaxel@gmail.com', contrasena: 'axel123', registrado: true },
            { nombre: 'Benjamin', email: 'correodebenjamin@gmail.com', contrasena: 'benjamin123', registrado: true },
            { nombre: 'Brian', email: 'correodebrian@gmail.com', contrasena: 'brian123', registrado: true },
            { nombre: 'Catalina', email: 'correodecatalina@gmail.com', contrasena: 'catalina123', registrado: true },
            { nombre: 'Dmitri', email: 'correodedmitri@gmail.com', contrasena: 'dmitri123', registrado: true },
            { nombre: 'Donald', email: 'correodedonald@gmail.com', contrasena: 'donald123', registrado: true },
            { nombre: 'Dylan', email: 'correodedylan@gmail.com', contrasena: 'dylan123', registrado: true },
            { nombre: 'Elías', email: 'correodeelias@gmail.com', contrasena: 'elias123', registrado: true },
            { nombre: 'Emanuel', email: 'correodeemanuel@gmail.com', contrasena: 'emanuel123', registrado: true },
            { nombre: 'Esteban', email: 'correodeesteban@gmail.com', contrasena: 'esteban123', registrado: true },
            { nombre: 'Ezequiel', email: 'correodeezequiel@gmail.com', contrasena: 'ezequiel123', registrado: true },
            { nombre: 'Fabián', email: 'correodeafabian@gmail.com', contrasena: 'fabian123', registrado: true },
            { nombre: 'Fran', email: 'correodedefran@gmail.com', contrasena: 'fran123', registrado: true },
            { nombre: 'Francesca', email: 'correodefrancesca@gmail.com', contrasena: 'francesca123', registrado: true },
            { nombre: 'Francesco', email: 'correodefrancesco@gmail.com', contrasena: 'francesco123', registrado: true },
            { nombre: 'Gabriel', email: 'correodegabriel@gmail.com', contrasena: 'gabriel123', registrado: true },
            { nombre: 'Howard', email: 'correodehoward@gmail.com', contrasena: 'howard123', registrado: true },
            { nombre: 'Ismael', email: 'correodeismael@gmail.com', contrasena: 'ismael123', registrado: true },
            { nombre: 'Jack', email: 'correodejack@gmail.com', contrasena: 'jack123', registrado: true },
            { nombre: 'James', email: 'correodejames@gmail.com', contrasena: 'james123', registrado: true },
            { nombre: 'Jesse', email: 'correodejesse@gmail.com', contrasena: 'jesse123', registrado: true },
            { nombre: 'Jesús', email: 'correodejesus@gmail.com', contrasena: 'jesus123', registrado: true },
            { nombre: 'Justin', email: 'correodejustin@gmail.com', contrasena: 'justin123', registrado: true },
            { nombre: 'Karina', email: 'correodekarina@gmail.com', contrasena: 'karina123', registrado: true },
            { nombre: 'Kevin', email: 'correodekevin@gmail.com', contrasena: 'kevin123', registrado: true },
            { nombre: 'Leo', email: 'correodeleo@gmail.com', contrasena: 'leo123', registrado: true },
            { nombre: 'Maria', email: 'correodemaria@gmail.com', contrasena: 'maria123', registrado: true },
            { nombre: 'Mariana', email: 'correoemariana@gmail.com', contrasena: 'mariana123', registrado: true },
            { nombre: 'Michelle', email: 'correodemichelle@gmail.com', contrasena: 'michelle123', registrado: true },
            { nombre: 'Monica', email: 'correodemonica@gmail.com', contrasena: 'monica123', registrado: true },
            { nombre: 'Nahuel', email: 'correodenahuel@gmail.com', contrasena: 'nahuel123', registrado: true },
            { nombre: 'Pamela', email: 'correodepamela@gmail.com', contrasena: 'pamela123', registrado: true },
            { nombre: 'Paolo', email: 'correodepaolo@gmail.com', contrasena: 'paolo123', registrado: true },
            { nombre: 'Patricia', email: 'correodepatrica@gmail.com', contrasena: 'patricia123', registrado: true },
            { nombre: 'Paul', email: 'correodepaul@gmail.com', contrasena: 'paul123', registrado: true },
            { nombre: 'Putín', email: 'correodeputin@gmail.com', contrasena: 'putin123', registrado: true },
            { nombre: 'Ralph', email: 'correoderalph@gmail.com', contrasena: 'ralph123', registrado: true },
            { nombre: 'Samuel', email: 'correodesamuel@gmail.com', contrasena: 'samuel123', registrado: true },
            { nombre: 'Sandra', email: 'correodesamdra@gmail.com', contrasena: 'sandra123', registrado: true },
            { nombre: 'Sebastián', email: 'correodesebastin@gmail.com', contrasena: 'sebastian123', registrado: true },
            { nombre: 'Tabitha', email: 'correodetabitha@gmail.com', contrasena: 'tabitha123', registrado: true },
            { nombre: 'Thomas', email: 'correodethomas@gmail.com', contrasena: 'thomas123', registrado: true },
            { nombre: 'Ulises', email: 'correodeulises@gmail.com', contrasena: 'ulises123', registrado: true },
            { nombre: 'Valeria', email: 'correodevaleria@gmail.com', contrasena: 'valeria123', registrado: true },
            { nombre: 'Valentina', email: 'correodevalentina@gmail.com', contrasena: 'valentina123', registrado: true },
            { nombre: 'Victor', email: 'correodevctor@gmail.com', contrasena: 'victor123', registrado: true },
            { nombre: 'Victoria', email: 'correodevictoria@gmail.com', contrasena: 'victoria123', registrado: true },
            { nombre: 'Zadiel', email: 'correodezadiel@gmail.com', contrasena: 'zadiel123', registrado: true },
        );

        if (usuarios.length > 0) await Usuario.bulkCreate(usuarios);
    } catch (error) { console.log(error); }
}

async function crearPublicaciones() {
    try {
        const usuarios = await Usuario.findAll({ attributes: ['id'], raw: true });
        const publicaciones = [];

        for (let i = 1; i <= Math.floor(Math.random() * 500) + usuarios.length; i++) {
            const usuarioRandom = usuarios[Math.floor(Math.random() * usuarios.length)];
            publicaciones.push({
                titulo: `Publicación autogenerada ${i}`,
                descripcion: `Descripción autogenerada de la publicación autogenerada ${i}`,
                id_usuario: usuarioRandom.id
            });
        }

        if (publicaciones.length > 0) await Publicacion.bulkCreate(publicaciones, { chunkSize: 2000, returning: false, validate: false });
    } catch (error) { console.log(error); }
}

async function crearImagenes() {
    try {
        const publicaciones = await Publicacion.findAll({ attributes: ['id'], raw: true });
        const imagenes = [];

        for (const pub of publicaciones) {
            for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
                const probabilidad = Math.random() > 0.75;
                imagenes.push({
                    imagen: `https://picsum.photos/seed/${Math.floor(Math.random() * 1000000)}/600/400`,
                    licencia: probabilidad,
                    comentarios: Math.random() > 0.1,
                    marcaDeAgua: probabilidad ? 'Marca de agua' : null,
                    id_publicacion: pub.id
                });
            }
        }

        if (imagenes.length > 0) await Imagen.bulkCreate(imagenes, { chunkSize: 2000, returning: false, validate: false });
    } catch (error) { console.log(error); }
}

async function crearComentarios() {
    try {
        const [usuarios, imagenes, publicaciones] = await Promise.all([
            Usuario.findAll({ attributes: ['id'], raw: true }),
            Imagen.findAll({ attributes: ['id', 'id_publicacion'], raw: true }),
            Publicacion.findAll({ attributes: ['id', 'id_usuario'], raw: true })
        ]);
        const comentarios = [], notificaciones = [];

        for (const imagen of imagenes) {
            const pub = publicaciones.find(pub => pub.id === imagen.id_publicacion);
            for (let i = 1; i < Math.floor(Math.random() * 50) + 1; i++) {
                const usuarioRandom = usuarios[Math.floor(Math.random() * usuarios.length)];
                comentarios.push({
                    texto: `Comentario autogenerado ${i}`,
                    id_usuario: usuarioRandom.id,
                    id_imagen: imagen.id
                });
                notificaciones.push({
                    tipo_evento: 'Comentó',
                    id_dueno: pub.id_usuario,
                    id_causante: usuarioRandom.id,
                    id_imagen: imagen.id
                });
            }
            if (notificaciones.length >= 2000) { await Notificacion.bulkCreate(notificaciones, { returning: false, validate: false }); notificaciones.length = 0; }
        }

        if (comentarios.length > 0) await Comentario.bulkCreate(comentarios), { chunkSize: 2000, returning: false, validate: false };
        if (notificaciones.length > 0) await Notificacion.bulkCreate(notificaciones);
    } catch (error) { console.log(error); }
}

async function crearEtiquetas() {
    try {
        const publicaciones = await Publicacion.findAll({ attributes: ['id'], raw: true });
        const etiquetas = [];

        for (const pub of publicaciones) {
            for (let i = 1; i < Math.floor(Math.random() * 5) + 1; i++) {
                etiquetas.push({
                    nombre: `etiqueta ${i}`,
                    id_publicacion: pub.id
                });
            }
        }

        if (etiquetas.length > 0) await Etiqueta.bulkCreate(etiquetas, { chunkSize: 2000, returning: false, validate: false });
    } catch (error) { console.log(error); }
}

async function crearMensajes() {
    try {
        const usuarios = await Usuario.findAll({ attributes: ['id'] });
        let indice = 1;
        
        for (const usuario of usuarios) {
            const [seguidos, seguidores] = await Promise.all([
                usuario.getSeguidos() || [],
                usuario.getSeguidores() || []
            ]);
            
            const chat = new Set([...seguidos.map(u => u.id), ...seguidores.map(u => u.id)]);
            for (const c of chat) { await crearConversacion(usuario.id, c); }
        }

        async function crearConversacion(id1, id2) {
            const mensajes = [];

            for (let i = 0; i < Math.floor(Math.random() * 50); i++) {
                if (Math.random() > 0.75) {
                    const esEmisor = Math.random() > 0.5;
                    const id_Emisor = esEmisor ? id1 : id2;
                    const id_Receptor = esEmisor ? id2 : id1;
    
                    mensajes.push({
                        texto: `Mensaje autogenerado ${indice}`,
                        id_usuario: id_Emisor,
                        id_seguido: id_Receptor
                    });
                    indice++;
                }
                if (mensajes.length >= 2000) { await Mensaje.bulkCreate(mensajes, { returning: false, validate: false }); mensajes.length = 0; }
            }

            if (mensajes.length > 0) await Mensaje.bulkCreate(mensajes, { chunkSize: 2000, returning: false, validate: false });
        }
    } catch (error) { console.log(error); }
}

async function crearDenuncias() {
    try {
        const [comentarios, imagenes, usuarios, publicaciones] = await Promise.all([
            Comentario.findAll({ attributes: ['id', 'id_usuario'], raw: true }),
            Imagen.findAll({ attributes: ['id', 'id_publicacion'], raw: true }),
            Usuario.findAll({ attributes: ['id', 'nombre'], raw: true }),
            Publicacion.findAll({ attributes: ['id', 'id_usuario'], raw: true })
        ]);
        const notificaciones = [];

        for (const com of comentarios) {
            for (const usuario of usuarios) {
                if (Math.random() > 0.99 && usuario.id !== com.id_usuario) {
                    notificaciones.push({
                        tipo_evento: 'Denuncia',
                        motivo: `${usuario.nombre} denunció el comentario con ID: ${com.id}`,
                        id_dueno: com.id_usuario,
                        id_causante: usuario.id,
                        id_comentario: com.id
                    });
                }
            }
            if (notificaciones.length >= 2000) { await Notificacion.bulkCreate(notificaciones, { returning: false, validate: false }); notificaciones.length = 0; }
        }

        for (const imagen of imagenes) {
            const publicacion = publicaciones.find(pub => pub.id === imagen.id_publicacion);
            for (const usuario of usuarios) {
                if (Math.random() > 0.99 && usuario.id !== publicacion.id_usuario) {
                    notificaciones.push({
                        tipo_evento: 'Denuncia',
                        motivo: `${usuario.nombre} denunció la imagen con el ID: ${imagen.id}`,
                        id_dueno: publicacion.id_usuario,
                        id_causante: usuario.id,
                        id_imagen: imagen.id
                    });
                }
            }
            if (notificaciones.length >= 2000) { await Notificacion.bulkCreate(notificaciones, { returning: false, validate: false }); notificaciones.length = 0; }
        }

        if (notificaciones.length > 0) await Notificacion.bulkCreate(notificaciones, { chunkSize: 2000, returning: false, validate: false });
    } catch (error) { console.log(error); }
}

async function crearFavoritos() {
    try {
        const [usuarios, publicaciones] = await Promise.all([
            Usuario.findAll({ attributes: ['id', 'nombre'], raw: true }),
            Publicacion.findAll({ attributes: ['id'], raw: true })
        ]);
        const favoritos = [];

        for (const usuario of usuarios) {
            for (const pub of publicaciones) {
                if (Math.random() > 0.95) {
                    favoritos.push({
                        nombre: `Lista ${Math.floor(Math.random() * 7) + 1}`,
                        id_usuario: usuario.id,
                        id_publicacion: pub.id
                    });
                }
            }
        }

        if (favoritos.length > 0) await Favorito.bulkCreate(favoritos, { chunkSize: 2000, returning: false, validate: false });
    } catch (error) { console.log(error); }
}

async function crearValoraciones() {
    try {
        const [imagenes, usuarios, publicaciones] = await Promise.all([
            Imagen.findAll({ attributes: ['id', 'id_publicacion'], raw: true }),
            Usuario.findAll({ attributes: ['id'], raw: true }),
            Publicacion.findAll({ attributes: ['id', 'id_usuario'], raw: true })
        ]);
        const valoraciones = [];
        const notificaciones = [];

        for (const imagen of imagenes) {
            const pub = publicaciones.find(pub => pub.id === imagen.id_publicacion);
            for (const usuario of usuarios) {
                if (usuario.id !== pub.id_usuario) {
                    if (Math.random() < 0.35) {
                        valoraciones.push({
                            valoracion: Math.random() > 0.5,
                            id_imagen: imagen.id,
                            id_usuario: usuario.id
                        });
                        notificaciones.push({
                            tipo_evento: 'Valorizó',
                            id_dueno: pub.id_usuario,
                            id_causante: usuario.id,
                            id_imagen: imagen.id
                        });
                    }
                }
            }
            if (notificaciones.length >= 2000) { await Notificacion.bulkCreate(notificaciones, { returning: false, validate: false }); notificaciones.length = 0; }
        }

        if (valoraciones.length > 0) await Valoracion.bulkCreate(valoraciones, { chunkSize: 2000, returning: false, validate: false });
        if (notificaciones.length > 0) await Notificacion.bulkCreate(notificaciones, { chunkSize: 2000, returning: false, validate: false });
    } catch (error) { console.log(error); }
}

async function crearSeguidosYSeguidores() {
    try {
        const usuarios = await Usuario.findAll();
        const notificaciones = [];

        for (const usuario1 of usuarios) {
            for (const usuario2 of usuarios) {
                if (usuario1 !== usuario2) {
                    const loSigue = await usuario1.hasSeguidos(usuario2);
                    const probabilidad = Math.random() > 0.85;

                    if (probabilidad && !loSigue) {
                        await usuario1.addSeguidos(usuario2);
                        notificaciones.push({
                            tipo_evento: 'Nuevo seguidor',
                            id_causante: usuario1.id,
                            id_dueno: usuario2.id
                        });
                    }
                    if (!probabilidad && loSigue) {
                        await usuario1.removeSeguidos(usuario2);
                        notificaciones.push({
                            tipo_evento: 'Dejó de seguirte',
                            id_causante: usuario1.id,
                            id_dueno: usuario2.id
                        });
                    }
                }
            }
            if (notificaciones.length >= 2000) { await Notificacion.bulkCreate(notificaciones, { returning: false, validate: false }); notificaciones.length = 0; }
        }

        if (notificaciones.length > 0) await Notificacion.bulkCreate(notificaciones, { chunkSize: 2000, returning: false, validate: false });
    } catch (error) { console.log(error); }
}

async function crearIntereses() {
    try {
        const [imagenes, usuarios, publicaciones] = await Promise.all([
            Imagen.findAll({ attributes: ['id', 'id_publicacion'], raw: true }),
            Usuario.findAll({ attributes: ['id'], raw: true }),
            Publicacion.findAll({ attributes: ['id', 'id_usuario'], raw: true })
        ]);
        const notificaciones = [];

        for (const imagen of imagenes) {
            const publicacion = publicaciones.find(pub => pub.id === imagen.id_publicacion);
            for (const usuario of usuarios) {
                if (Math.random() > 0.98 && publicacion.id_usuario !== usuario.id) {
                    notificaciones.push({
                        tipo_evento: 'Interés',
                        motivo: 'Me interesa porque sí',
                        id_dueno: publicacion.id_usuario,
                        id_causante: usuario.id,
                        id_imagen: imagen.id
                    });
                }
            }
            if (notificaciones.length >= 2000) { await Notificacion.bulkCreate(notificaciones, { returning: false, validate: false }); notificaciones.length = 0; }
        }

        if (notificaciones.length > 0) await Notificacion.bulkCreate(notificaciones, { chunkSize: 2000, returning: false, validate: false });
    } catch (error) { console.log(error); }
}

async function crearValidaciones() {
    try {
        const denuncias = await Notificacion.findAll({ where: { tipo_evento: 'Denuncia' }, include: [{ model: Imagen }] });
        const denunciasFiltradas = denuncias.filter(d => d.id_imagen !== null);
        for (const d of denunciasFiltradas) {
            const cantidad = await Notificacion.count({ where: { tipo_evento: 'Denuncia', id_imagen: d.id_imagen } });
            if (cantidad >= 3) await Validador.create({ id_publicacion: d.Imagen.id_publicacion });
        }
    } catch (error) { console.log(error); }
}

module.exports = { popular };