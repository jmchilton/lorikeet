// $LastChangedDate$
// $LastChangedBy$
// $LastChangedRevision$

INTERNAL_ION_COLOR = "#C71585";

function InternalIon(peptide, start, end, massType) {
    var sequence = "";
    for(var i = start; i < end; i++) {
        var aa = peptide.sequence().charAt(i);
        var staticMod = peptide.staticMods()[aa];
        var variableMod = peptide.varMods()[i];
        var mod = (staticMod ? staticMod.modMass : 0) + (variableMod ? variableMod.modMass : 0);
        sequence += aa + (mod != 0 ? ("(" + mod + ")") : "");
    }
    this.sequence = sequence;
    this.label = "<" + sequence + ">";
    // TODO: Verify calculation, depends on massType?   
    this.mz = peptide.getSeqMass(start, end, "n", massType) + Ion.MASS_PROTON;
}

var getInternalIons = function(peptide, massType) {
    var seqLength = peptide.sequence().length;
    var labels = [];
    var interalIons = [];
    for(var i = 1; i < seqLength - 1; i++) {
        for(var j = i + 2; j < seqLength; j++) {
            var internalIon = new InternalIon(peptide, i, j, massType);
            var label = internalIon.label;
            if(!labels[label]) {
                labels[label] = true;
                interalIons.push(internalIon);
            }
        }
    }
    interalIons.sort(function(ion1, ion2) { return ion1.mz - ion2.mz;})
    return interalIons;
}