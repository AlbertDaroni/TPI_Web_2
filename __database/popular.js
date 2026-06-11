const { Imagen, Mensaje, Usuario, Etiqueta, Favorito, Validador, Comentario, Valoracion, Publicacion, Notificacion } = require('./models');

async function popular() {
    try {
        await crearUsuarios();
        await crearSeguidosYSeguidores();
        await crearMensajes();
        await crearPublicaciones();
        await crearImagenes();
        await crearEtiquetas();
        await crearValoraciones();
        await crearComentarios();
        await crearFavoritos();
        await crearIntereses();
        await crearDenuncias();
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
            { nombre: 'Abdiél', email: 'correodeabdiel@gmail.com', contrasena: 'abdiel123', registrado: true },
            { nombre: 'Alan', email: 'correodealan@gmail.com', contrasena: 'alan123', registrado: true },
            { nombre: 'Alicia', email: 'correodealicia@gmail.com', contrasena: 'alicia123', registrado: true },
            { nombre: 'Alexander', email: 'correodealexander@gmail.com', contrasena: 'alexander123', registrado: true },
            { nombre: 'Amélie', email: 'correodeamelie@gmail.com', contrasena: 'amelie123', registrado: true },
            { nombre: 'Ana', email: 'correodeana@gmail.com', contrasena: 'ana123', registrado: true },
            { nombre: 'Anastasia', email: 'correodeanastasia@gmail.com', contrasena: 'anastasia123', registrado: true },
            { nombre: 'André', email: 'correodeandre@gmail.com', contrasena: 'andre123', registrado: true },
            { nombre: 'Andrés', email: 'correodeandres@gmail.com', contrasena: 'andres123', registrado: true },
            { nombre: 'Andrey', email: 'correodeandrey@gmail.com', contrasena: 'andrey123', registrado: true },
            { nombre: 'Ángel', email: 'correodeangel@gmail.com', contrasena: 'angel123', registrado: true },
            { nombre: 'Anthony', email: 'correodeanthony@gmail.com', contrasena: 'anthony123', registrado: true },
            { nombre: 'Antonio', email: 'correodeantonio@gmail.com', contrasena: 'antonio123', registrado: true },
            { nombre: 'Ariana', email: 'correodeariana@gmail.com', contrasena: 'ariana123', registrado: true },
            { nombre: 'Arthur', email: 'correodearthur@gmail.com', contrasena: 'arthur123', registrado: true },
            { nombre: 'Axel', email: 'correodeaxel@gmail.com', contrasena: 'axel123', registrado: true },
            { nombre: 'Benjamin', email: 'correodebenjamin@gmail.com', contrasena: 'benjamin123', registrado: true },
            { nombre: 'Brian', email: 'correodebrian@gmail.com', contrasena: 'brian123', registrado: true },
            { nombre: 'Brandon', email: 'correodebrandon@gmail.com', contrasena: 'brandon123', registrado: true },
            { nombre: 'Bruce', email: 'correodebruce@gmail.com', contrasena: 'bruce123', registrado: true },
            { nombre: 'Catalina', email: 'correodecatalina@gmail.com', contrasena: 'catalina123', registrado: true },
            { nombre: 'Christopher', email: 'correodechristopher@gmail.com', contrasena: 'christopher123', registrado: true },
            { nombre: 'Claude', email: 'correodeclaude@gmail.com', contrasena: 'claude123', registrado: true },
            { nombre: 'Cristian', email: 'correodecristian@gmail.com', contrasena: 'cristian123', registrado: true },
            { nombre: 'Cristina', email: 'correodecristina@gmail.com', contrasena: 'cristina123', registrado: true },
            { nombre: 'Damián', email: 'correodedamian@gmail.com', contrasena: 'damian123', registrado: true },
            { nombre: 'Daniel', email: 'correodedaniel@gmail.com', contrasena: 'daniel123', registrado: true },
            { nombre: 'David', email: 'correodedavid@gmail.com', contrasena: 'david123', registrado: true },
            { nombre: 'Delfina', email: 'correodedelfina@gmail.com', contrasena: 'delfina123', registrado: true },
            { nombre: 'Diana', email: 'correodediana@gmail.com', contrasena: 'diana123', registrado: true },
            { nombre: 'Dmitri', email: 'correodedmitri@gmail.com', contrasena: 'dmitri123', registrado: true },
            { nombre: 'Donald', email: 'correodedonald@gmail.com', contrasena: 'donald123', registrado: true },
            { nombre: 'Dominique', email: 'correodedominique@gmail.com', contrasena: 'dominique123', registrado: true },
            { nombre: 'Dylan', email: 'correodedylan@gmail.com', contrasena: 'dylan123', registrado: true },
            { nombre: 'Edward', email: 'correodeEdward@gmail.com', contrasena: 'edward123', registrado: true },
            { nombre: 'Ekaterina', email: 'correodeekaterina@gmail.com', contrasena: 'ekaterina123', registrado: true },
            { nombre: 'Eliana', email: 'correodeeliana@gmail.com', contrasena: 'eliana123', registrado: true },
            { nombre: 'Elías', email: 'correodeelias@gmail.com', contrasena: 'elias123', registrado: true },
            { nombre: 'Emanuel', email: 'correodeemanuel@gmail.com', contrasena: 'emanuel123', registrado: true },
            { nombre: 'Eric', email: 'correodeeric@gmail.com', contrasena: 'eric123', registrado: true },
            { nombre: 'Esteban', email: 'correodeesteban@gmail.com', contrasena: 'esteban123', registrado: true },
            { nombre: 'Ezequiel', email: 'correodeezequiel@gmail.com', contrasena: 'ezequiel123', registrado: true },
            { nombre: 'Fabián', email: 'correodeafabian@gmail.com', contrasena: 'fabian123', registrado: true },
            { nombre: 'Fran', email: 'correodedefran@gmail.com', contrasena: 'fran123', registrado: true },
            { nombre: 'Frank', email: 'correodefrank@gmail.com', contrasena: 'frank123', registrado: true },
            { nombre: 'Francesca', email: 'correodefrancesca@gmail.com', contrasena: 'francesca123', registrado: true },
            { nombre: 'Francesco', email: 'correodefrancesco@gmail.com', contrasena: 'francesco123', registrado: true },
            { nombre: 'Gabriel', email: 'correodegabriel@gmail.com', contrasena: 'gabriel123', registrado: true },
            { nombre: 'Gael', email: 'correodegael@gmail.com', contrasena: 'gael123', registrado: true },
            { nombre: 'Gastón', email: 'correodegaston@gmail.com', contrasena: 'gaston123', registrado: true },
            { nombre: 'George', email: 'correodegeorge@gmail.com', contrasena: 'george123', registrado: true },
            { nombre: 'Germán', email: 'correodegerman@gmail.com', contrasena: 'german123', registrado: true },
            { nombre: 'Giovanni', email: 'correodegiovanni@gmail.com', contrasena: 'giovanni123', registrado: true },
            { nombre: 'Giulia', email: 'correodegiulia@gmail.com', contrasena: 'giulia123', registrado: true },
            { nombre: 'Gregory', email: 'correodegregory@gmail.com', contrasena: 'gregory123', registrado: true },
            { nombre: 'Harold', email: 'correodeharold@gmail.com', contrasena: 'harold123', registrado: true },
            { nombre: 'Harry', email: 'correodeharry@gmail.com', contrasena: 'harry123', registrado: true },
            { nombre: 'Henry', email: 'correodehenry@gmail.com', contrasena: 'henry123', registrado: true },
            { nombre: 'Howard', email: 'correodehoward@gmail.com', contrasena: 'howard123', registrado: true },
            { nombre: 'Igor', email: 'correodeigor@gmail.com', contrasena: 'igor123', registrado: true },
            { nombre: 'Inés', email: 'correodeines@gmail.com', contrasena: 'ines123', registrado: true },
            { nombre: 'Irina', email: 'correodeirina@gmail.com', contrasena: 'irina123', registrado: true },
            { nombre: 'Isabel', email: 'correodeisabel@gmail.com', contrasena: 'isabel123', registrado: true },
            { nombre: 'Isabella', email: 'correodeisabella@gmail.com', contrasena: 'isabella123', registrado: true },
            { nombre: 'Isaías', email: 'correodeisaias@gmail.com', contrasena: 'isaias123', registrado: true },
            { nombre: 'Ismael', email: 'correodeismael@gmail.com', contrasena: 'ismael123', registrado: true },
            { nombre: 'Jack', email: 'correodejack@gmail.com', contrasena: 'jack123', registrado: true },
            { nombre: 'James', email: 'correodejames@gmail.com', contrasena: 'james123', registrado: true },
            { nombre: 'Jason', email: 'correodejason@gmail.com', contrasena: 'jason123', registrado: true },
            { nombre: 'Jeremy', email: 'correodejeremy@gmail.com', contrasena: 'jeremy123', registrado: true },
            { nombre: 'Jerry', email: 'correodejerry@gmail.com', contrasena: 'jerry123', registrado: true },
            { nombre: 'Jesse', email: 'correodejesse@gmail.com', contrasena: 'jesse123', registrado: true },
            { nombre: 'Jesús', email: 'correodejesus@gmail.com', contrasena: 'jesus123', registrado: true },
            { nombre: 'Jimmy', email: 'correodejimmy@gmail.com', contrasena: 'jimmy123', registrado: true },
            { nombre: 'John', email: 'correodejohn@gmail.com', contrasena: 'john123', registrado: true },
            { nombre: 'Jonathan', email: 'correodejonathan@gmail.com', contrasena: 'jonathan123', registrado: true },
            { nombre: 'Joseph', email: 'correodejoseph@gmail.com', contrasena: 'joseph123', registrado: true },
            { nombre: 'Joshua', email: 'correodejoshua@gmail.com', contrasena: 'joshua123', registrado: true },
            { nombre: 'Juan', email: 'correodejuan@gmail.com', contrasena: 'juan123', registrado: true },
            { nombre: 'Joaquín', email: 'correodejoaquin@gmail.com', contrasena: 'joaquin123', registrado: true },
            { nombre: 'Julián', email: 'correodejulian@gmail.com', contrasena: 'julian123', registrado: true },
            { nombre: 'Juliana', email: 'correodejuliana@gmail.com', contrasena: 'juliana123', registrado: true },
            { nombre: 'Justin', email: 'correodejustin@gmail.com', contrasena: 'justin123', registrado: true },
            { nombre: 'Karina', email: 'correodekarina@gmail.com', contrasena: 'karina123', registrado: true },
            { nombre: 'Kevin', email: 'correodekevin@gmail.com', contrasena: 'kevin123', registrado: true },
            { nombre: 'Laurent', email: 'correodelauren@gmail.com', contrasena: 'laurent123', registrado: true },
            { nombre: 'Lawrence', email: 'correedelawrence@gmail.com', contrasena: 'lawrence123', registrado: true },
            { nombre: 'Leo', email: 'correodeleo@gmail.com', contrasena: 'leo123', registrado: true },
            { nombre: 'Leonard', email: 'correodeleonard@gmail.com', contrasena: 'leonard123', registrado: true },
            { nombre: 'Leslie', email: 'correodeleslie@gmail.com', contrasena: 'leslie123', registrado: true },
            { nombre: 'Lionel', email: 'correode lioinel@gmail.com', contrasena: 'lionel123', registrado: true },
            { nombre: 'Louis', email: 'correodelouis@gmail.com', contrasena: 'louis123', registrado: true },
            { nombre: 'Lourdes', email: 'correodeloudes@gmail.com', contrasena: 'lourdes123', registrado: true },
            { nombre: 'Lucia', email: 'correodelucia@gmail.com', contrasena: 'lucia123', registrado: true },
            { nombre: 'Lucas', email: 'correodelucas@gmail.com', contrasena: 'lucas123', registrado: true },
            { nombre: 'Luc', email: 'correadeluc@gmail.com', contrasena: 'luc123', registrado: true },
            { nombre: 'Luque', email: 'correoluque@gmail.com', contrasena: 'luque123', registrado: true },
            { nombre: 'Manuel', email: 'correodemanuel@gmail.com', contrasena: 'manuel123', registrado: true },
            { nombre: 'Marco', email: 'correodemarco@gmail.com', contrasena: 'marco123', registrado: true },
            { nombre: 'Maria', email: 'correodemaria@gmail.com', contrasena: 'maria123', registrado: true },
            { nombre: 'Mariana', email: 'correoemariana@gmail.com', contrasena: 'mariana123', registrado: true },
            { nombre: 'Marina', email: 'correodemarina@gmail.com', contrasena: 'marina123', registrado: true },
            { nombre: 'Mark', email: 'correodemark@gmail.com', contrasena: 'mark123', registrado: true },
            { nombre: 'Martin', email: 'correodemartin@gmail.com', contrasena: 'martin123', registrado: true },
            { nombre: 'Matías', email: 'correodematias@gmail.com', contrasena: 'matias123', registrado: true },
            { nombre: 'Matthew', email: 'correodematthew@gmail.com', contrasena: 'matthew123', registrado: true },
            { nombre: 'Michael', email: 'correodemichael@gmail.com', contrasena: 'michael123', registrado: true },
            { nombre: 'Michelle', email: 'correodemichelle@gmail.com', contrasena: 'michelle123', registrado: true },
            { nombre: 'Miguel', email: 'correodemiguel@gmail.com', contrasena: 'miguel123', registrado: true },
            { nombre: 'Mikhail', email: 'correodekhail@gmail.com', contrasena: 'mikhail123', registrado: true },
            { nombre: 'Mitchell', email: 'correodemitchell@gmail.com', contrasena: 'mitchell123', registrado: true },
            { nombre: 'Monica', email: 'correodemonica@gmail.com', contrasena: 'monica123', registrado: true },
            { nombre: 'Nahuel', email: 'correodenahuel@gmail.com', contrasena: 'nahuel123', registrado: true },
            { nombre: 'Nathan', email: 'correodenatahn@gmail.com', contrasena: 'nathan123', registrado: true },
            { nombre: 'Natasha', email: 'correonatasha@gmail.com', contrasena: 'natasha123', registrado: true },
            { nombre: 'Nelson', email: 'correodenelson@gmail.com', contrasena: 'nelson123', registrado: true },
            { nombre: 'Nicolas', email: 'correonicolas@gmail.com', contrasena: 'nicolas123', registrado: true },
            { nombre: 'Nicole', email: 'correodenicole@gmail.com', contrasena: 'nicole123', registrado: true },
            { nombre: 'Nieves', email: 'correodenieves@gmail.com', contrasena: 'nieves123', registrado: true },
            { nombre: 'Norma', email: 'correodenorma@gmail.com', contrasena: 'norma123', registrado: true },
            { nombre: 'Oscar', email: 'correodeoscar@gmail.com', contrasena: 'oscar123', registrado: true },
            { nombre: 'Olga', email: 'correodelga@gmail.com', contrasena: 'olga123', registrado: true },
            { nombre: 'Pamela', email: 'correodepamela@gmail.com', contrasena: 'pamela123', registrado: true },
            { nombre: 'Paolo', email: 'correodepaolo@gmail.com', contrasena: 'paolo123', registrado: true },
            { nombre: 'Patricia', email: 'correodepatrica@gmail.com', contrasena: 'patricia123', registrado: true },
            { nombre: 'Patrick', email: 'correodepatrick@gmail.com', contrasena: 'patrick123', registrado: true },
            { nombre: 'Paul', email: 'correodepaul@gmail.com', contrasena: 'paul123', registrado: true },
            { nombre: 'Peter', email: 'correodepeter@gmail.com', contrasena: 'peter123', registrado: true },
            { nombre: 'Philip', email: 'correodephilip@gmail.com', contrasena: 'philip123', registrado: true },
            { nombre: 'Phyllis', email: 'correodephyllis@gmail.com', contrasena: 'phyllis123', registrado: true },
            { nombre: 'Pierre', email: 'correodepierre@gmail.com', contrasena: 'pierre123', registrado: true },
            { nombre: 'Putín', email: 'correodeputin@gmail.com', contrasena: 'putin123', registrado: true },
            { nombre: 'Ralph', email: 'correoderalph@gmail.com', contrasena: 'ralph123', registrado: true },
            { nombre: 'Randy', email: 'correoderandy@gmail.com', contrasena: 'randy123', registrado: true },
            { nombre: 'Ray', email: 'correoderay@gmail.com', contrasena: 'ray123', registrado: true },
            { nombre: 'Raymond', email: 'correoderaymond@gmail.com', contrasena: 'raymond123', registrado: true },
            { nombre: 'Rafael', email: 'correoderafael@gmail.com', contrasena: 'rafael123', registrado: true },
            { nombre: 'Raquel', email: 'correoderaquel@gmail.com', contrasena: 'raquel123', registrado: true },
            { nombre: 'Richard', email: 'correoderichard@gmail.com', contrasena: 'richard123', registrado: true },
            { nombre: 'Robert', email: 'correoderobert@gmail.com', contrasena: 'robert123', registrado: true },
            { nombre: 'Roberto', email: 'correoroberto@gmail.com', contrasena: 'roberto123', registrado: true },
            { nombre: 'Roger', email: 'correoderoger@gmail.com', contrasena: 'roger123', registrado: true },
            { nombre: 'Ronald', email: 'correodeanald@gmail.com', contrasena: 'ronald123', registrado: true },
            { nombre: 'Rose', email: 'correoderose@gmail.com', contrasena: 'rose123', registrado: true },
            { nombre: 'Rosalia', email: 'correoderosalia@gmail.com', contrasena: 'rosalia123', registrado: true },
            { nombre: 'Roy', email: 'correoderoy@gmail.com', contrasena: 'roy123', registrado: true },
            { nombre: 'Ruby', email: 'correoderuby@gmail.com', contrasena: 'ruby123', registrado: true },
            { nombre: 'Russell', email: 'correoderussel@gmail.com', contrasena: 'russell123', registrado: true },
            { nombre: 'Ryan', email: 'correodyryan@gmail.com', contrasena: 'ryan123', registrado: true },
            { nombre: 'Samuel', email: 'correodesamuel@gmail.com', contrasena: 'samuel123', registrado: true },
            { nombre: 'Sandra', email: 'correodesamdra@gmail.com', contrasena: 'sandra123', registrado: true },
            { nombre: 'Scott', email: 'correodescott@gmail.com', contrasena: 'scott123', registrado: true },
            { nombre: 'Sean', email: 'correodesan@gmail.com', contrasena: 'sean123', registrado: true },
            { nombre: 'Sebastián', email: 'correodesebastin@gmail.com', contrasena: 'sebastian123', registrado: true },
            { nombre: 'Sergei', email: 'correodseregei@gmail.com', contrasena: 'sergei123', registrado: true },
            { nombre: 'Sharon', email: 'correodesharon@gmail.com', contrasena: 'sharon123', registrado: true },
            { nombre: 'Sienna', email: 'correodesienna@gmail.com', contrasena: 'sienna123', registrado: true },
            { nombre: 'Silvia', email: 'correodesilvia@gmail.com', contrasena: 'silvia123', registrado: true },
            { nombre: 'Simone', email: 'correodeimone@gmail.com', contrasena: 'simone123', registrado: true },
            { nombre: 'Sofia', email: 'correodesofia@gmail.com', contrasena: 'sofia123', registrado: true },
            { nombre: 'Sonia', email: 'correodesonia@gmail.com', contrasena: 'sonia123', registrado: true },
            { nombre: 'Sophia', email: 'corredesophia@gmail.com', contrasena: 'sophia123', registrado: true },
            { nombre: 'Stanley', email: 'correodestanley@gmail.com', contrasena: 'stanley123', registrado: true },
            { nombre: 'Stella', email: 'correodestella@gmail.com', contrasena: 'stella123', registrado: true },
            { nombre: 'Stephen', email: 'correodestephen@gmail.com', contrasena: 'stephen123', registrado: true },
            { nombre: 'Steven', email: 'correodesteven@gmail.com', contrasena: 'steven123', registrado: true },
            { nombre: 'Stuart', email: 'corredestuart@gmail.com', contrasena: 'stuart123', registrado: true },
            { nombre: 'Susan', email: 'correodesusan@gmail.com', contrasena: 'susan123', registrado: true },
            { nombre: 'Svetlana', email: 'corredesvetlana@gmail.com', contrasena: 'svetlana123', registrado: true },
            { nombre: 'Sydney', email: 'corredesydney@gmail.com', contrasena: 'sydney123', registrado: true },
            { nombre: 'Sylvie', email: 'corredesylvie@gmail.com', contrasena: 'sylvie123', registrado: true },
            { nombre: 'Tabitha', email: 'correodetabitha@gmail.com', contrasena: 'tabitha123', registrado: true },
            { nombre: 'Talia', email: 'correodetalia@gmail.com', contrasena: 'talia123', registrado: true },
            { nombre: 'Tamara', email: 'correodetamara@gmail.com', contrasena: 'tamara123', registrado: true },
            { nombre: 'Tatiana', email: 'correodetaiana@gmail.com', contrasena: 'tatiana123', registrado: true },
            { nombre: 'Thomas', email: 'correodethomas@gmail.com', contrasena: 'thomas123', registrado: true },
            { nombre: 'Timothy', email: 'correodetimothy@gmail.com', contrasena: 'timothy123', registrado: true },
            { nombre: 'Tobías', email: 'correodetobias@gmail.com', contrasena: 'tobias123', registrado: true },
            { nombre: 'Tomás', email: 'correodetomas@gmail.com', contrasena: 'tomas123', registrado: true },
            { nombre: 'Tony', email: 'correodetony@gmail.com', contrasena: 'tony123', registrado: true },
            { nombre: 'Tyler', email: 'correodetyer@gmail.com', contrasena: 'tyler123', registrado: true },
            { nombre: 'Ulises', email: 'correodeulises@gmail.com', contrasena: 'ulises123', registrado: true },
            { nombre: 'Uriel', email: 'correodeulies@gmail.com', contrasena: 'uriel123', registrado: true },
            { nombre: 'Valeria', email: 'correodevaleria@gmail.com', contrasena: 'valeria123', registrado: true },
            { nombre: 'Valentina', email: 'correodevalentina@gmail.com', contrasena: 'valentina123', registrado: true },
            { nombre: 'Vanessa', email: 'correodevnessa@gmail.com', contrasena: 'vanessa123', registrado: true },
            { nombre: 'Véronique', email: 'correodevéronique@gmail.com', contrasena: 'veronique123', registrado: true },
            { nombre: 'Victor', email: 'correodevctor@gmail.com', contrasena: 'victor123', registrado: true },
            { nombre: 'Victoria', email: 'correodevictoria@gmail.com', contrasena: 'victoria123', registrado: true },
            { nombre: 'Vincent', email: 'correodevincent@gmail.com', contrasena: 'vincent123', registrado: true },
            { nombre: 'Virginia', email: 'correodevriginia@gmail.com', contrasena: 'virginia123', registrado: true },
            { nombre: 'Vladimir', email: 'correodevladim@gmail.com', contrasena: 'vladimir123', registrado: true },
            { nombre: 'Vivian', email: 'correodevivian@gmail.com', contrasena: 'vivian123', registrado: true },
            { nombre: 'Walter', email: 'correodewalter@gmail.com', contrasena: 'walter123', registrado: true },
            { nombre: 'Wayne', email: 'correooewayne@gmail.com', contrasena: 'wayne123', registrado: true },
            { nombre: 'William', email: 'correodewilliam@gmail.com', contrasena: 'william123', registrado: true },
            { nombre: 'Yulia', email: 'correodeyulia@gmail.com', contrasena: 'yulia123', registrado: true },
            { nombre: 'Zachary', email: 'correodezachary@gmail.com', contrasena: 'zachary123', registrado: true },
            { nombre: 'Zadiel', email: 'correodezadiel@gmail.com', contrasena: 'zadiel123', registrado: true },
            { nombre: 'Zara', email: 'correodezara@gmail.com', contrasena: 'zara123', registrado: true },
            { nombre: 'Zoe', email: 'correodezoe@gmail.com', contrasena: 'zoe123', registrado: true }
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

        if (publicaciones.length > 0) await Publicacion.bulkCreate(publicaciones);
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

        if (imagenes.length > 0) await Imagen.bulkCreate(imagenes);
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
            if (notificaciones.length >= 2000) { await Notificacion.bulkCreate(notificaciones); notificaciones.length = 0; }
        }

        if (comentarios.length > 0) await Comentario.bulkCreate(comentarios);
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

        if (etiquetas.length > 0) await Etiqueta.bulkCreate(etiquetas);
    } catch (error) { console.log(error); }
}

async function crearMensajes() {
    try {
        const usuarios = await Usuario.findAll();
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
                if (mensajes.length >= 2000) { await Mensaje.bulkCreate(mensajes); mensajes.length = 0; }
            }

            if (mensajes.length > 0) await Mensaje.bulkCreate(mensajes);
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
            if (notificaciones.length >= 2000) { await Notificacion.bulkCreate(notificaciones); notificaciones.length = 0; }
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
            if (notificaciones.length >= 2000) { await Notificacion.bulkCreate(notificaciones); notificaciones.length = 0; }
        }

        if (notificaciones.length > 0) await Notificacion.bulkCreate(notificaciones);
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

        if (favoritos.length > 0) await Favorito.bulkCreate(favoritos);
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
            if (notificaciones.length >= 2000) { await Notificacion.bulkCreate(notificaciones); notificaciones.length = 0; }
        }

        if (valoraciones.length > 0) await Valoracion.bulkCreate(valoraciones);
        if (notificaciones.length > 0) await Notificacion.bulkCreate(notificaciones);
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
            if (notificaciones.length >= 2000) { await Notificacion.bulkCreate(notificaciones); notificaciones.length = 0; }
        }

        if (notificaciones.length > 0) await Notificacion.bulkCreate(notificaciones);
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
            if (notificaciones.length >= 2000) { await Notificacion.bulkCreate(notificaciones); notificaciones.length = 0; }
        }

        if (notificaciones.length > 0) await Notificacion.bulkCreate(notificaciones);
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