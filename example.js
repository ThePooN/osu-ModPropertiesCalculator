var ModPropertiesCalculator = require("./index");

console.log(ModPropertiesCalculator.calcProperties({
	AR: 8,
	OD: 9,
	BPM: 150,
	CS: 4
}, ModPropertiesCalculator.mods.HardRock.value + ModPropertiesCalculator.mods.DoubleTime.value));
