const calc = require('ojsama')
const { Beatmap, Calculator } = require('rosu-pp')

module.exports = function ({parser,mod_num,combo,count_100,count_50,count_miss,acc,mode}) {
    let stars = new calc.diff().calc({map: parser.map, mods: mod_num})
    let bpm = 0
    let bpmchanged = 0
    for (var i = 0; i < stars.map.timing_points.length; i++) {
        if (stars.map.timing_points[i].change == true) {
            bpmchanged += 1
            bpm += 60000 / Number(stars.map.timing_points[i].ms_per_beat)
        }
    }
    bpm = Math.round(bpm / bpmchanged)
    let object = Number(stars.objects.length)
    let accuracy = 0
    if (mode == 'fc') {
        let count_300 = object - count_100 - count_50
        accuracy = Number((300 * count_300 + 100 * count_100 + 50 * count_50) / (300 * (count_300 + count_100 + count_50)) * 100).toFixed(2)
    } else if (mode == 'acc') accuracy = acc;
    let map = new Beatmap({path: "./beatmap-cache/"+ parser.beatmapId +"_rosu.osu"});
    let score = {
        mods: mod_num,
        mode: 0
    }
    let calculator = new Calculator(score);
    let currAttrs = calculator.acc(parseFloat(accuracy))
        .combo(Number(combo))
        .nMisses(Number(count_miss))
        .performance(map);
    let mapAttrs = calculator.mapAttributes(map);
    return {star: stars, pp: currAttrs, acc: accuracy, bpm: bpm, ar: mapAttrs.ar, od: mapAttrs.od, hp: mapAttrs.hp, cs: mapAttrs.cs}
}