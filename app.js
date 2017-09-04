'use strict';
this.onload = function () {

    keyboardEvent();
    mouseEvent();

    showTime(function() {
                clock.innerHTML = '<p>' + this.toLocaleTimeString() + '</p>';
                date.innerHTML = '<p>' + this.toDateString().replace(/\s.+$/, '') + ', ' + this.toDateString().replace(/^\w+\s(\w+\s\d+)\s\d+$/, '$1') + '</p>';
            });
    
    

    setInterval(function () { 
        showTime(function() {
                clock.innerHTML = '<p>' + this.toLocaleTimeString() + '</p>';
                date.innerHTML = '<p>' + this.toDateString().replace(/\s.+$/, '') + ', ' + this.toDateString().replace(/^\w+\s(\w+\s\d+)\s\d+$/, '$1') + '</p>';
            });
    }, 1000);

    

};
// Date & Time variables
var date = document.getElementById('date'),
    clock = document.getElementById('time'),
    // Calculator variables
    topScreen = '',
    bottomScreen = '',
    calculation = '',
    calculationObject = {},
    topCalculation = document.getElementById('top-calculation'),
    bottomCalculation = document.getElementById('bottom-calculation'),
    buttons = document.getElementsByClassName('buttons');

function mouseEvent() {
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', mouseClick);
    }
}


function keyboardEvent() { 
    document.addEventListener('keydown', keyboardKeys); 
}

function showTime(fn) {
    var time = new Date();
    
    return fn.bind(time)();
}





// Calculator Methods ...
var calculatorMethods = 
    {
        clearAll: function(value) {
            value = '';
            calculation = '';
            topScreen = '';
            bottomScreen = ''; 
        },

        deleteOne: function(value) {
            value = '';
            calculation = calculation.slice(0, -1);
            topScreen = topScreen.slice(0, -1);
            bottomScreen = bottomScreen.slice(0, -1);
        },

        negate: function() {
            if(calculation !== '') {
                if(calculation.match(/(\+|-\/|\*|\^)/) !== null) {
                    this.equal('=');
                }  
                topScreen = 'negate(' + parseFloat(calculation) + ')';
                calculation = (-parseFloat(calculation)).toString();
                bottomScreen = calculation;
            }
        },

        sinus: function() {
            if(calculation !== '') {
                if(calculation.match(/(\+|-\/|\*|\^)/) !== null) {
                    this.equal('=');
                }  

                topScreen = 'sin(' + parseFloat(calculation) + ')';
                calculation = Math.sin(parseFloat(calculation)).toFixed(12).toString();
                bottomScreen = calculation;
            }
        },

        cosinus: function() {
            if(calculation !== '') {
                if(calculation.match(/(\+|-\/|\*|\^)/) !== null) {
                    this.equal('=');
                }  
                topScreen = 'cos(' + parseFloat(calculation) + ')';
                calculation = Math.cos(parseFloat(calculation)).toFixed(12).toString();
                bottomScreen = calculation;
            }
        },

        squareRoot: function() {
            if(calculation !== '') {
                if(calculation.match(/(\+|-\/|\*|\^)/) !== null) {
                    this.equal('=');
                }  
                topScreen = '√(' + parseFloat(calculation) + ')';
                calculation = Math.sqrt(parseFloat(calculation)).toFixed(12).toString();
                if(calculation === 'NaN') {
                    bottomScreen = 'Invalid input';
                    calculation = '';
                } else {
                    if(calculation.match(/0+$/) !== null) {
                        calculation = calculation.replace(/(\.0+|0+)$/, '');
                    }
                   bottomScreen = calculation;
                }       
            }
        },
        
        dot: function(value) {
            if(calculation === '' || calculation.match(/\d+\.\d+$/) !== null || calculation.match(/(\*|\/|-|\+|\.)$/) !== null) {
                value = '';
            } else {
                calculation += value;
                topScreen = calculation;
                bottomScreen += value;
            }
        },

        brackets: function() {

                if(calculation.match(/\(/) === null || calculation.match(/\)\W$/) !== null) {
                    calculation += '(';
                } else if(calculation.match(/\d+$/) !== null) {
                    calculation += ')';
                }
                topScreen = calculation;
   
        },

        basicOperations: function(value) {
            if(calculation === '') {
                value = '';
            }
            if(calculation.match(/\[^A-Za-z0-9\)]$/) !== null) {
                calculation = calculation.replace(/\W$/, value);
                topScreen = calculation;
            } else {
                calculation += value;
                topScreen = calculation;
            }
        },

        numbers: function(value) {
            if(calculation.match(/(\*|\+|-|\/|\^)$/) !== null) {
                bottomScreen = '';
            }
            if(topScreen.match(/[a-z]+\((-\d+)|(\d+)\)$/) !== null || topScreen.match(/=$/) !== null) {
                topScreen = '';
                bottomScreen = '';
                calculation = '';
            }
            if(topScreen.match(/\($/) !== null) {
                bottomScreen = '';
            }
            calculation += value;
            topScreen += value;
            bottomScreen += value;
        },

        equal: function(value) {
            if(calculation === '' || calculation.match(/(\*|\+|-|\/|\^)/) === null  ) {
                value = '';
            } 
            if(calculation.match(/(\*|\+|-|\/|\^)$/) !== null) {
                calculation = calculation.replace(/\W/, '=');
                topScreen = calculation;
                calculation = parseFloat(calculation).toString();
            } else if(calculation.match(/\^/) !== null) {
                calculation = Math.pow(parseFloat(calculation.match(/^(-\d+|\d+)/)[0]), parseFloat(calculation.match(/(-\d+|\d+)$/)[0]));
                calculation = calculation.toString();
                topScreen += value;
                bottomScreen = calculation;
            } else {
                topScreen += value;
                calculation = eval(calculation).toFixed(12).toString();
                if(calculation.match(/0+$/) !== null) {
                    calculation = calculation.replace(/(\.0+|0+)$/, '');
                }
                bottomScreen = calculation;
            }     
        }

    };


function keyboardKeys(ev) {
    var value = ev.key;
    console.log(ev);

    switch(value) {

        case 'Delete':
            calculatorMethods.clearAll(value);
            break;

        case 'Backspace':
            calculatorMethods.deleteOne(value);
            break;

        case '+':
            calculatorMethods.basicOperations('+');
            break;

        case '-':
            calculatorMethods.basicOperations('-');
            break;

        case '*':
            calculatorMethods.basicOperations('*');
            break;

        case '/':
            calculatorMethods.basicOperations('/');
            break;

        case '=':
            calculatorMethods.equal('=');
            break;

        case 's':
            calculatorMethods.sinus();
            break;

        case 'c':
            calculatorMethods.cosinus();
            break;

        case 'Enter':
            calculatorMethods.equal('=');
            break;

        case '1':
            calculatorMethods.numbers(value);
            break;

        case '2':
            calculatorMethods.numbers(value);
            break;

        case '3':
            calculatorMethods.numbers(value);
            break;

        case '4':
            calculatorMethods.numbers(value);
            break;

        case '5':
            calculatorMethods.numbers(value);
            break;

        case '6':
            calculatorMethods.numbers(value);
            break;

        case '7':
            calculatorMethods.numbers(value);
            break;

        case '8':
            calculatorMethods.numbers(value);
            break;

        case '9':
            calculatorMethods.numbers(value);
            break;

                }

    topCalculation.innerHTML = topScreen;
    bottomCalculation.innerHTML = bottomScreen;
}

function mouseClick() {

    var value = this.innerHTML;

    switch(value) {

        case 'AC':
            calculatorMethods.clearAll(value);
            break;

        case 'DEL':
            calculatorMethods.deleteOne(value);
            break;

        case '+/-':
            calculatorMethods.negate();
            break;

        case 'sin':
            calculatorMethods.sinus();
            break;

        case 'cos':
            calculatorMethods.cosinus();
            break;

        case '√':
            calculatorMethods.squareRoot();
            break;

        case 'x<sup>n</sup>':
            calculatorMethods.basicOperations('^');
            break;
        
        case '(...)':
            calculatorMethods.brackets();
            break;

        case '=':
            calculatorMethods.equal('=');
            break;

        case '.':
            calculatorMethods.dot(value);
            break;

        case '+':
            calculatorMethods.basicOperations('+');
            break;

        case '-':
            calculatorMethods.basicOperations('-');
            break;

        case '÷':
            calculatorMethods.basicOperations('/');
            break;

        case '×':
            calculatorMethods.basicOperations('*');
            break;

        default:
            calculatorMethods.numbers(value);
                }


    topCalculation.innerHTML = topScreen;
    bottomCalculation.innerHTML = bottomScreen;
}







