/*
   # Comando para reproducir música, no funcionara si haces c&p ;)
 */
module.exports.play = async (client, message, busqueda) => {
	/* Requiere los paquetes */
	const ytdl = require('ytdl-core')
	const ytsh = require('yt-search')
	const youtube = require('youtube-dl')
	/* Requiere la funcion para inicializar el objeto play, y otros objetos */
	let { playobject } = require('../../inicialization/newPlayObject.js')
	let { newSongObjectUrl } = require('../function/newSongObjectUrl.js')

	/* Define IDs de autor y servidor */
	let userid = message.author.id
	let serverid = message.guild.id

	/* Condicionales de verificacion de busqueda */
	if (!message.member.voiceChannel)
		throw new Error(
			'El miembro autor del mensaje no se encuentra actualmente en un canal de voz.'
		)
	if (!busqueda[0] && !client.music[message.guild.id].rep)
		throw new Error(
			'El miembro autor del mensaje no proporciono un termino de busqueda, y actualmente no se esta reproduciendo nada.'
		)

	/* Inicializa el objeto play */
	if (!client.music[message.guild.id]) {
		new playobject()
	}

	/* Condicionales para reproduccion de musica */

	if (client.music[message.guild.id].rep) {
		if (!busqueda[0])
			throw new Error(
				'El miembro autor del mensaje no proporciono un termino de busqueda.'
			)
		if (
			busqueda[0].match(
				/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/i
			)
		) {
			youtube.getInfo(busqueda[0], async (err, vi) => {
				ytsh(
					vi.title.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
					async (err, v) => {
						if (err)
							throw new Error(
								'Ocurrio un error buscando la cancion de el link proporcionado.'
							)

						let song = new newSongObjectUrl(v, message)

						client.music[message.guild.id].queue.push(song)
						client.music[message.guild.id].cur = song
					}
				)
			})
		}
	}
}