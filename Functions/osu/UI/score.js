const score_fm = require('../score_format')
const get_diff_icon = require('../get_diff_icon')
const icon_lib = require('../../general/icon_lib')

module.exports = function ({ top = 0, title, beatmap_id, star, mod_text, pp, rank_icon, diff, score, rank,
    combo, fc, acc, acc_detail, fcguess, mapcomplete = '', time_ago = '', type, a_mode, countgeki, count300 }) {
    let showtop = ''
    let showtitle = ''
    let showpp = ''
    let showmapcomplete = ''
    let ratio = "";
    if (a_mode == 'mania') ratio = Number(Number(countgeki) / Number(count300)).toFixed(2).toString();
    if (top > 0) showtop = `${top}.`
    if (fcguess !== '') fcguess = '• ' + fcguess
    if (rank == 'F') {
        showpp = `__${Number(pp).toFixed(2)}pp__`
        showmapcomplete = mapcomplete
    }
    else showpp = `${Number(pp).toFixed(2)}pp`
    if (type == 'top' || type == 'recent') {
        showtitle = `**[${title}](https://osu.ppy.sh/b/${beatmap_id})** `
    } else if (type == 'compare') {
        showtitle = ''
    } else if (type == 'map') {
        showtitle = `**[${title}](https://osu.ppy.sh/osu/${beatmap_id})** `
    }
    let diff_icon = get_diff_icon({ star: star, a_mode: a_mode })
    let line1 = `${showtop} ${diff_icon} ${showtitle} (${star}★) \`${mod_text}\` • ${score_fm({ score: score })}`
    let line2 = `\n${rank_icon} ${type != 'map' ? "*" + diff + "*" : ''} • **${showpp}** • x${combo}/${fc} ${a_mode == 'mania' ? "▸ " + ratio + ":1" : ""}\n`
    let line3 = `${acc.toFixed(2)}% \`${acc_detail}\` ${fcguess}`
    let line4 = `\n${showmapcomplete ? showmapcomplete + " • " : ''}${time_ago}`
    if (type == 'recent') line4 = '';
    return `${line1}${line2}${line3}${line4}\n\n`
}