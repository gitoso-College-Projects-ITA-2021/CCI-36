var rule = new Map() 
rule.set('F' , "FF");
rule.set('A' , "B-F+CFC+F-D&F^D-F+&&CFC+F+B//");
rule.set('B' , "A&F^CFB^F^D^^-F-D^|F^B|FC^F^A//");
rule.set('C' , "|D^|F^B-F+C^F^A&&FA&F^C+F+B^F^D//");
rule.set('D' , "|CFB-F+B|FA&F^A&&FB-F+B|FC//");

var rule2 = new Map();
rule2.set('A' , "[&FL!A]/////'[&FL!A]///////'[&FL!A]");
rule2.set('F' , "S ///// F");
rule2.set('S' , "F L");
//'L' : "['''^^{-f+f+f-|-f+f+f}]"

var initial = new String('A');

function generate_string(n) {
    var string = initial;
    while (n > 0) {
        var tempString = new String('');
        for (let i = 0, n = string.length; i < n; ++i) {
            let c = string[i];
            if (rule2.has(c))
                tempString = tempString.concat('', String(rule2.get(c)));
            else
                tempString = tempString.concat('', String(c));
        }
        string = tempString;
        n = n - 1;
    }
    return string
}


