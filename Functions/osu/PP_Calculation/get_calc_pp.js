const get_mode_detail = require('../get_mode_detail')
const std_pp_calc = require('./std_pp_calc')
const getLocalText = require('../../../Lang/lang_handler')
const {Calculator, Beatmap} = require('rosu-pp')

module.exports = ({ pp, mode, parser, mod_num, mod_text, score, combo, fc, star, count_300, count_100, count_50,
    count_miss, count_geki, count_katu, acc, perfect, recent = false, cs, od, ar, hp, circle, slider, lang }) => {
    try {
        let map = new Beatmap({path: "./beatmap-cache/"+ parser.beatmapId +"_rosu.osu"});
        let localText = getLocalText({ lang: lang }).osu.fx_calc_pp
        let fcpp = 0
        let fcacc = 0
        let fcguess = ''
        let mapcomplete = ''
        let { a_mode, check_type } = get_mode_detail({ mode: mode })
        if (a_mode == 'std') {
            if (!parser.map.objects.length) return null;
            let fccalc = std_pp_calc({
                parser: parser, mod_num: mod_num, combo: fc, count_100: count_100, count_50: count_50,
                count_miss: 0, acc: acc, mode: 'fc'
            })
            fcpp = Number(fccalc.pp.pp).toFixed(2)
            fcacc = fccalc.acc
            star = Number(fccalc.pp.difficulty.stars).toFixed(2)
            if (check_type == "bancho" && recent) {
                let end = fccalc.star.objects[fccalc.star.objects.length - 1].obj.time - fccalc.star.objects[0].obj.time
                let point = fccalc.star.objects[count_300 + count_100 + count_50 + count_miss - 1].obj.time - fccalc.star.objects[0].obj.time
                mapcomplete = `${localText.completed}: ${Number((point / end) * 100).toFixed(2)}%`
                let recentcalc = std_pp_calc({
                    parser: parser, mod_num: mod_num, combo: combo, count_100: count_100, count_50: count_50,
                    count_miss: count_miss, acc: acc, mode: 'acc'
                })
                pp = Number(recentcalc.pp.pp)
            }
        } else if (a_mode == 'taiko') {
            let count_300 = fc - count_100
            fcacc = Number(Number((0.5 * count_100 + count_300) / (count_300 + count_100) * 100).toFixed(2))
            let score = {
                mods: mod_num,
                mode: 1
            }
            let calculator = new Calculator(score);
            let currAttrs = calculator.acc(Number(fcacc))
                .combo(Number(fc))
                .performance(map);
            fcpp = (currAttrs.pp).toFixed(2)
            if (check_type == "bancho" && recent) {
                mapcomplete = `${localText.completed}: ${Number(((count_300 + count_100 + count_miss) / circle + slider) * 100).toFixed(2)}%`
                let score = {
                    mods: mod_num,
                    mode: 1
                }
                let calculator = new Calculator(score);
                let currAttrs = calculator.acc(Number(acc))
                    .combo(Number(fc))
                    .nMisses(Number(count_miss))
                    .performance(map);
                pp = (currAttrs.pp).toFixed(2)
            }
        } else if (a_mode == 'ctb') {
            let count_300 = fc - count_100 - count_50
            fcacc = Number((count_50 + count_100 + count_300) / (count_50 + count_100 + count_300) * 100).toFixed(2)
            let score = {
                mods: mod_num,
                mode: 2
            }
            let calculator = new Calculator(score);
            let currAttrs = calculator.acc(Number(fcacc))
                .combo(Number(fc))
                .performance(map);
            fcpp = (currAttrs.pp).toFixed(2)
            if (check_type == "bancho" && recent) {
                mapcomplete = `${localText.completed}: ${Number(((count_300 + count_katu + count_100 + count_50 + count_miss) / (circle + slider)) * 100).toFixed(2)}%`
                let score = {
                    mods: mod_num,
                    mode: 2,
                    n300: Number(count_300),
                    n100: Number(count_100),
                    n50: Number(count_50),
                    nKatu: Number(count_katu),
                    nMisses: Number(count_miss),
                    combo: Number(fc)
                }
                let calculator = new Calculator(score);
                let currAttrs = calculator.performance(map);
                console.log(currAttrs);
                console.log(circle);
                console.log(slider);
                pp = (currAttrs.pp).toFixed(2)
            }
        } else if (a_mode == 'mania') {
            fcacc = 100;
            let mScore = {
                mods: mod_num,
                mode: 3
            }
            let calculator = new Calculator(mScore);
            let currAttrs = calculator.acc(fcacc)
                .performance(map);
            fcpp = (currAttrs.pp).toFixed(2)
            star = currAttrs.difficulty.stars;
            if (check_type == "bancho" && recent) {
                mapcomplete = `${localText.completed}: ${Number(((count_300 + count_katu + count_100 + count_geki + count_50 + count_miss) / (circle + slider)) * 100).toFixed(2)}%`
                let mScore = {
                    mods: mod_num,
                    mode: 3
                }
                let calculator = new Calculator(mScore);
                let currAttrs = calculator.nGeki(count_geki)
                    .nKatu(count_katu)
                    .n300(count_300)
                    .n100(count_100)
                    .n50(count_50)
                    .nMisses(count_miss)
                    .performance(map);
                pp = (currAttrs.pp).toFixed(2)
            }
        }
        if (perfect == 0) {
            fcguess = `${fcacc}% FC ⇒ ${fcpp}pp`
        }
        return { pp: Number(pp), star: Number(star).toFixed(2), fcguess: fcguess, mapcomplete: mapcomplete }
    } catch (err) {
        console.log(`\nget_calc_pp.js\n${err}`)
    }
}