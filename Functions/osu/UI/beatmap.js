const std_pp_calc = require('./../PP_Calculation/std_pp_calc')
const { MessageEmbed } = require('discord.js-light')
const get_mode_detail = require('./../get_mode_detail')
const beatmap_detail = require('./../beatmap_detail')
const get_diff_icon = require('../get_diff_icon')
const { Beatmap, Calculator } = require('rosu-pp')

function getMapIcon({ status }) {
    const statusicons = {
        "Graveyard": "https://i.imgur.com/9nZUUnW.png",
        "WIP": "https://i.imgur.com/9nZUUnW.png",
        "Pending": "https://i.imgur.com/9nZUUnW.png",
        "Ranked": "https://i.imgur.com/d8KQvaj.png",
        "Approved": "https://i.imgur.com/TovnvNY.png",
        "Qualified": "https://i.imgur.com/TovnvNY.png",
        "Loved": "https://i.imgur.com/ELaRD0i.png"
    }
    return statusicons[status];
};

module.exports = ({ map, parser, mode, mod_num, mod_text, creator_user, embed_color }) => {
    let { modenum, a_mode } = get_mode_detail({ mode: mode })
    let diffdetail = '', ppdetail = '', mapdetail = '';
    let star = (modenum !== 0) ? Number(Number(map.star).toFixed(2)) : 0
    let acc_calc_list = [95, 97, 99, 100]
    let detail = beatmap_detail({
        mod_num: mod_num, mode: mode, time_total: map.time_total, bpm: map.bpm,
        cs: map.cs, ar: map.ar, od: map.od, hp: map.hp
    })
    for (let d in detail) {
        if (d == 'bpm' || d == 'time_total') detail[d] = Number(Number(detail[d]).toFixed(0))
        else detail[d] = Number(Number(detail[d]).toFixed(2))
    }

    mod_num = mod_num ? mod_num : 0;
    let calcMap = new Beatmap({ path: "./beatmap-cache/" + parser.beatmapId + "_rosu.osu" });
    let score = {
        mods: mod_num
    }
    let calculator = new Calculator(score);
    let calc = calculator.performance(calcMap);
    star = Number(calc.difficulty.stars).toFixed(2);
    //
    let { cs, ar, od, hp, bpm, time_total } = detail
    let time = `${Math.floor(time_total / 60)}:${('0' + (time_total - Math.floor(time_total / 60) * 60)).slice(-2)}`
    if (modenum == 0) {
        let acc_list = acc_calc_list.map(a => std_pp_calc({
            parser: parser, mod_num: mod_num,
            combo: map.fc, mode: 'acc', acc: a
        }))
        star = Number(acc_list[0].pp.difficulty.stars).toFixed(2)
        diffdetail = `(Aim: ${Number(acc_list[0].pp.difficulty.aim).toFixed(2) * 2}★, Speed: ${Number(acc_list[0].pp.difficulty.speed).toFixed(2) * 2}★)`
        mapdetail = `**AR:** ${ar} • **OD:** ${od} • **HP:** ${hp} • **CS:** ${cs}`
        ppdetail = acc_calc_list.map((v, i) => `**${v}%**-${Number(acc_list[i].pp.pp).toFixed(2)}pp`).join(' • ')
    } else if (modenum == 1) {
        let acc_list = [];
        acc_calc_list.forEach(a => {
            let tempCalc = calculator.acc(Number(a))
                .mode(1)
                .performance(calcMap);
            pp = tempCalc.pp;
            acc_list.push(pp)
        });
        mapdetail = `**OD:** ${od} • **HP:** ${hp}`
        ppdetail = acc_calc_list.map((v, i) => `**${v}%**-${Number(acc_list[i]).toFixed(2)}pp`).join(' • ')
    } else if (modenum == 2) {
        let acc_list = [];
        acc_calc_list.forEach(a => {
            let tempCalc = calculator.acc(Number(a))
                .mode(2)
                .performance(calcMap);
            pp = tempCalc.pp;
            acc_list.push(pp)
        });
        mapdetail = `**AR:** ${ar} • **OD:** ${od} • **HP:** ${hp} • **CS:** ${cs}`
        ppdetail = acc_calc_list.map((v, i) => `**${v}%**-${Number(acc_list[i]).toFixed(2)}pp`).join(' • ')
    } else if (modenum == 3) {
        let acc_list = [];
        acc_calc_list.forEach(a => {
            let tempCalc = calculator.acc(Number(a))
                .mode(3)
                .performance(calcMap);
            pp = tempCalc.pp;
            acc_list.push(pp)
        });
        mapdetail = `**Keys:** ${cs} • **OD:** ${od} • **HP:** ${hp}`
        ppdetail = acc_calc_list.map((v, i) => `**${v}%**-${Number(acc_list[i]).toFixed(2)}pp`).join(' • ')
    }
    let diff_icon = get_diff_icon({ star: star, a_mode: a_mode })

    if (creator_user?.id == undefined) {
        creator_user = {
            id: null
        }
    }

    let embed_desc = `${diff_icon} __${map.diff}__ \`${mod_text}\`
Mapped by: [**${map.creator}**](https://osu.ppy.sh/users/${creator_user.id})
**Difficulty:** ${star}★ ${diffdetail}
**Max Combo:** ${map.fc}
${mapdetail}`
    let embed_mapdetail = `<:length:998397497724641280>: ${time}
<:bpm:998397499515605002>: ${bpm}
<:circle:998397501549850674>: ${map.circle}
<:slider:998397503076577311>: ${map.slider}
<:spinner:998397505282781264>: ${map.spinner}`
    let embed_download = `[bancho](https://osu.ppy.sh/d/${map.beatmapset_id}) • [bancho no vid](https://osu.ppy.sh/d/${map.beatmapset_id}n) • [bloodcat](http://bloodcat.com/osu/s/${map.beatmapset_id})`
    let embed_pp = `${ppdetail}`
    let embed = new MessageEmbed()
    embed.setAuthor({ name: `${map.title} (${map.artist})`, iconURL: `https://a.ppy.sh/${creator_user.id}?0.png`, url: `https://osu.ppy.sh/b/${map.beatmap_id}` })
    embed.addFields(
        { name: '\u200B', value: embed_desc, inline: true },
        { name: '\u200B', value: embed_mapdetail, inline: true },
        { name: 'Downloads', value: embed_download },
        { name: 'Estimated PP if FC:', value: embed_pp }

    )
    embed.setImage(`https://assets.ppy.sh/beatmaps/${map.beatmapset_id}/covers/cover@2x.jpg`)
    embed.setColor(embed_color)
    embed.setFooter({ text: `${map.approvalStatus} • ❤: ${map.favorite}`, iconURL: `${getMapIcon({status: map.approvalStatus})}` });
    return embed
}