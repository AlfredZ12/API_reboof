module.exports={
     
    equalsto: function (operand_1, operator, operand_2, options)  {
        var operators = {
         'eq': function(l,r) { return l == r; },
         'noteq': function(l,r) { return l != r; },
         
        }

        , result = operators[operator](operand_1,operand_2);
        console.log(operand_2);
      
        if (result){ console.log(result); return options.fn(this);
     } else console.log("inverse: " +result);  return options.inverse(this);
      }
   

}