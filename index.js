var Enum = require('enum');
var modsEnum = new Enum({"Easy": 2, "HardRock": 16, "DoubleTime": 64, "HalfTime": 256});

var mods = {
	"Easy": {
		"long_name": "Easy",
		"short_name": "EZ",
		"AR_mod": "AR",
		"AR_multiplier": 0.5,
		"CS_multiplier": 0.5,
		"HP_multiplier": 0.5,
		"OD_multiplier": 0.5
	},
	"HardRock": {
		"long_name": "HardRock",
		"short_name": "HR",
		"AR_mod": "AR",
		"AR_multiplier": 1.4,
		"AR_max": 10,
		"CS_multiplier": 1.3,
		"HP_multiplier": 1.4,
		"OD_mod": "OD",
		"OD_multiplier": 1.4,
		"OD_max": 10
	},
	"DoubleTime": {
		"long_name": "DoubleTime",
		"short_name": "DT",
		"AR_mod": "ms",
		"AR_multiplier": 2/3,
		"AR_max": 11,
		"OD_mod": "ms300",
		"OD_multiplier": 2/3,
		"OD_max": getOD(13, "ms300"),
		"BPM_multiplier": 1.5
	},
	"HalfTime": {
		"long_name": "HalfTime",
		"short_name": "HT",
		"AR_mod": "ms",
		"AR_multiplier": 4/3,
		"OD_mod": "ms300",
		"OD_multiplier": 4/3,
		"BPM_multiplier": 0.75
	}
};

exports.mods = modsEnum;

exports.calcProperties = function (properties, modsValue) {
	var appliedMods = modsEnum.get(modsValue);
	if(!appliedMods)
		return properties;

	var AR = null;
	var OD = null;

	modsEnum.enums.forEach(function(enumItem) {
		if(appliedMods.has(enumItem.key)) {
			var mod = mods[enumItem.key];
			for(var propertyTitle in properties) {
				var property = properties[propertyTitle];
				if(mod[propertyTitle+"_multiplier"]) {
					if(propertyTitle == "AR") {
						if(AR == null)
							AR = getAR(properties.AR, "AR");
						AR = getAR(AR[mod.AR_mod] * mod.AR_multiplier, mod.AR_mod);
						properties.AR = AR.AR;
					}
					else if(propertyTitle == "OD") {
						if(OD == null)
							OD = getOD(properties.OD, "OD");
						OD = getOD(OD[mod.OD_mod] * mod.OD_multiplier, mod.OD_mod);
						properties.OD = OD.OD;
					}
					else
						properties[propertyTitle] = properties[propertyTitle] * mod[propertyTitle+"_multiplier"];
					if(mod[propertyTitle+"_max"] != null && properties[propertyTitle] > mod[propertyTitle+"_max"])
						properties[propertyTitle] = mod[propertyTitle+"_max"];
					else if(mod[propertyTitle+"_min"] != null && properties[propertyTitle] < mod[propertyTitle+"_min"])
						properties[propertyTitle] = mod[propertyTitle+"_min"];
				}
			}
		}
	});

	return properties;
}

function getAR(AR, AR_type) {
	if(AR_type == "AR") {
		if(AR < 5)
			return {
				AR: AR,
				ms: 1800 - AR * 120,
			}
		else
			return {
				AR: AR,
				ms: 1200 - (AR - 5) * 150,
			}
	}
	else if(AR_type == "ms") {
		if(AR > 1200)
			return {
				AR: (1800 - AR) / 120,
				ms: AR
			}
		else
			return {
				AR: (1200 - AR) / 150 + 5,
				ms: AR
			}
	}
	else
		return null;
}

exports.getAR = getAR;

function getOD(OD, OD_type) {
	if(OD_type == "OD")
		return {
			OD: OD,
			ms300: 79.5 - 6 * OD
		}
	else if(OD_type == "ms300")
		return {
			OD: (79.5 - OD) / 6,
			ms300: OD
		}
	else
		return null;
}

exports.getOD = getOD;
