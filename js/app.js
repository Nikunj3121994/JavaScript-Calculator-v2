// forEach method implementation for older browsers...
if (!Object.prototype.forEach) {
     Object.prototype.forEach = function(fn, scope) {
        for(var i = 0, len = this.length; i < len; ++i) {
             fn.call(scope, this[i], i, this);
         }
     };
 }


this.onload = function() {

    displayTime('calculator');
    events();

    setInterval(function() {
        displayTime('calculator');
    }, 1000);
};

function displayTime(where)
{
    var date        = document.getElementById('date'),
        clock       = document.getElementById('time'),
        currentTime = new Date();

    if(where === 'history')
    {
        return function() {
            var hour    = this.getHours().toString(),
                minutes = this.getMinutes().toString();
           return hour + ':' + (minutes.length === 1 ? '0' + minutes : minutes);
        }.call(currentTime);
    }
    else if(where === 'calculator')
    {
        return function() {
            var re = /^(\w+)\s(\w+\s\d+)\s\d+$/;
            clock.innerHTML = '<p>' + this.toLocaleTimeString() + '</p>';
            date.innerHTML  = '<p>' + this.toDateString().replace(re, '$1, $2') + '</p>';
        }.call(currentTime);
    }
}




// Object with data & methods for presenting calculation history
var historyData =
{
    history: [],
    addHistory: function(calculation, time)
    {
        this.history.push({
            calculation: calculation,
            time: time
        });
        this.displayHistory();
    },
    removeOne: function(position) {
        this.history.splice(position, 1);
        this.displayHistory();
    },
    removeAll: function() {
        this.history = [];
        this.displayHistory();
    },
    displayHistory: function()
    {
        var historyUl = document.querySelector('ul');
        // Reset content of unordered list
        historyUl.innerHTML = '';
        this.history.forEach(function(history, position)
        {
            // Create list element
            var historyLi       = document.createElement('li');
            // Ad an id for deleting
            historyLi.id        = position;
            historyLi.innerHTML = '<div class="history-text"><span class="time"><span class="ion-ios-clock-outline"></span>' +
                                  ' ' + history.time + '</span>' +
                                  '<p class="history">' + history.calculation + '</p></div>' +
                                  '<div class="remove"><span class="ion-ios-trash-outline"></span></div>';
            historyUl.appendChild(historyLi);
        }, this);
    }
};

// DOM events
function events()
{
    // Array of buttons
    var buttons             = document.querySelectorAll('button'),
        deleteHistoryButton = document.getElementById('delete-history'),
        historyUl           = document.querySelector('ul');

    // IIFE for mouse click handling
    (function (buttons)
    {
        buttons.forEach(function(button)
        {
            button.addEventListener('click', function(e)
            {

                var value = this.innerHTML;
                // Call buttonHandlers function to 'deal' with button value
                buttonValueHandler(value);
            });
        });
    })(buttons);

    // IIFE for delete-history button
    (function (button)
    {
        button.addEventListener('click', function(e)
        {
            // Delete all history and remove whole history tab from displaying on smaller devices
            if(MEDIA_QUERIE.matches)
            {
                historyData.removeAll();
                document.getElementById('history').style.display = 'none';
            }
            // Delete all history and remove only the trash can from bottom of the history panel
            else
            {
                historyData.removeAll();
                document.getElementById('delete-history').style.display = 'none';
            }
        });
    })(deleteHistoryButton);

    // IIFE for delete-one button
    (function (list)
    {
        list.addEventListener('click', function(e)
        {
            // Element which was clicked... if it is a trash can
            var elementClicked = e.target;
            // if it is a trash can
            if(elementClicked.className === 'ion-ios-trash-outline')
            {
                // Remove grandparent element
                historyData.removeOne(elementClicked.parentNode.parentNode.id);
                // Remove whole history tab or history trash can depending on screen size
                if(list.children.length === 0)
                {
                    if(MEDIA_QUERIE.matches)
                        document.getElementById('history').style.display = 'none';
                    else
                        document.getElementById('delete-history').style.display = 'none';
                }
            }
        });
    })(historyUl);
}

// Global variables
var number            = '',
    display           = '',
    calculation       = '',
    previousOperation = '';
var DEFAULT_VALUE     = '0';
// constant for matching devices with width smaller than 730px
var MEDIA_QUERIE = window.matchMedia( "(max-width: 729px)" );

// To set zero at bottom screen
document.getElementById('bottom-calculation').innerHTML = DEFAULT_VALUE;

// For handling calculator button clicks
function buttonValueHandler(value)
{
    var topScreen    = document.getElementById('top-calculation'),
        bottomScreen = document.getElementById('bottom-calculation'),
        history      = document.getElementById('history');

    // Function for showing history tab on screens smaller than 730px
    function smallScreens()
    {
        if(MEDIA_QUERIE.matches)
            history.style.display = 'block';
    }

    function basicOperations(operator)
    {
        if(calculation !== '')
        {
            // For adding parenthesis if number has a negative value
            if(previousOperation === 'Negate')
            {
                display     = display.replace(/(-\d+(\.)?(\d+)?)$/, '($1)');
                calculation = calculation.replace(/(-\d+(\.)?(\d+)?)$/, '($1)');
            }
            // If previous value is equal, we didnt press any number
            // so we continue with previous result as the first parameter of calculation
            if(previousOperation === 'Equal'             ||
               previousOperation === 'Negate'            ||
               previousOperation === 'Factorial'         ||
               previousOperation === 'Other Operations'  ||
               previousOperation === 'PI')
            {
                display      = calculation;
                display      = display + ' ' + value + ' ';
                calculation += operator;
            }
            // To prevent from adding more than one operator
            if(calculation.match(/([-+/*])$/) !== null)
            {
                display = display.replace(/\s[-+÷×]\s$/, ' ' + value + ' ');
                calculation = calculation.replace(/[-+/*]$/, operator);
            }
            // Normal case
            else
            {
                display      = display +  ' ' + value + ' ';
                calculation += operator;
            }
            topScreen.innerHTML = display;
            previousOperation   = 'Basic Operation';
        }
    }

    function otherOperations(operation)
    {
        var validate = previousOperation === 'Equal'            ||
                       previousOperation === 'Negate'           ||
                       previousOperation === 'Factorial'        ||
                       previousOperation === 'Other Operation'  ||
                       previousOperation === 'PI';

        if(calculation !== '')
        {
            if(calculation.match(/[-+/*]$/))
                calculation = calculation.replace(/([-+/*])$/, '');
            if(operation === 'sqr' || operation === '√')
                display = operation + '(' + calculation + ')';
            else
                display = operation + '<sub>r</sub>(' + calculation + ')';

            switch(operation)
            {
                case 'sin':
                    if(validate)
                        calculation = Math.sin(parseFloat(calculation)).toFixed(8).toString().replace(/(\.0+|0+)$/, '');
                    else
                        calculation = Math.sin(parseFloat(eval(calculation))).toFixed(8).toString().replace(/(\.0+|0+)$/, '');
                    break;
                case 'cos':
                    if(validate)
                        calculation = Math.cos(parseFloat(calculation)).toFixed(8).toString().replace(/(\.0+|0+)$/, '');
                    else
                        calculation = Math.cos(parseFloat(eval(calculation))).toFixed(8).toString().replace(/(\.0+|0+)$/, '');
                    break;
                case 'tan':
                    if(validate)
                        calculation = Math.tan(parseFloat(calculation)).toFixed(8).toString().replace(/(\.0+|0+)$/, '');
                    else
                        calculation = Math.tan(parseFloat(eval(calculation))).toFixed(8).toString().replace(/(\.0+|0+)$/, '');
                    break;
                case 'sqr':
                    if(validate)
                        calculation = Math.pow(parseFloat(calculation), 2).toFixed(8).toString().replace(/(\.0+|0+)$/, '');
                    else
                        calculation = Math.pow(parseFloat(eval(calculation)), 2).toFixed(8).toString().replace(/(\.0+|0+)$/, '');
                    break;
                case '√':
                    if(validate)
                        calculation = Math.sqrt(parseFloat(calculation)).toFixed(8).toString().replace(/(\.0+|0+)$/, '');
                    else
                        calculation = Math.sqrt(parseFloat(eval(calculation))).toFixed(8).toString().replace(/(\.0+|0+)$/, '');
                    break;
            }
            if(calculation === 'NaN')
            {
                bottomScreen.innerHTML = 'Invalid Input!';
                calculation            = '';
                number                 = '';
                topScreen.innerHTML    = display;
                display                = '';
            }
            else
            {
                number                 = calculation;
                bottomScreen.innerHTML = calculation;
                topScreen.innerHTML    = display;
                previousOperation      = 'Other Operations';
            }
        }
    }

    function calculate()
    {
        if(calculation.match(/([-+/*])$/))
        {
            // To remove operator from string that is a last character in strings if it exists (2+2+) --> 2+2
            calculation = calculation.replace(/([-+/*])$/, '');
            display     = display.replace(/\s[-+÷×]\s$/, '');
        }
        // For continuously clicking equal operator --> Repeat last operation with result & last operand
        if(previousOperation === 'Equal')
        {
            if(display.match(/^((sqr)|(√)|(sin)|(cos)|(tan))/))
            {
                switch(display.match(/^((sqr)|(√)|(sin)|(cos)|(tan))/)[1])
                {
                    case 'sqr':
                        display     = 'sqr(' + calculation + ')';
                        calculation = Math.pow(parseFloat(calculation), 2).toFixed(8).toString().replace(/(\.0+|0+)$/, '');
                        break;
                    case '√':
                        display     = '√(' + calculation + ')';
                        calculation = Math.sqrt(parseFloat(calculation)).toFixed(8).toString().replace(/(\.0+|0+)$/, '');
                        break;
                    case 'sin':
                        display     = 'sin<sub>r</sub>(' + calculation + ')';
                        calculation = Math.sin(parseFloat(calculation)).toFixed(8).toString().replace(/(\.0+|0+)$/, '');
                        break;
                    case 'cos':
                        display     = 'cos<sub>r</sub>(' + calculation + ')';
                        calculation = Math.cos(parseFloat(calculation)).toFixed(8).toString().replace(/(\.0+|0+)$/, '');
                        break;
                    case 'tan':
                        display     = 'tan<sub>r</sub>(' + calculation + ')';
                        calculation = Math.tan(parseFloat(calculation)).toFixed(8).toString().replace(/(\.0+|0+)$/, '');
                        break;
                }
                bottomScreen.innerHTML = calculation;
                topScreen.innerHTML    = display;
                historyData.addHistory(display + ' = ' + calculation, displayTime('history'));
            }
            else
            {
                // Return from function if display string does not have an operator
                if(display.match(/[-+÷×]\s(\(-)?\d+/) === null || bottomScreen.innerHTML === 'Undefined')
                    return;
                // Find operators and numbers --> Result is an array of matching operators
                var match = display.match(/\s([-+÷×])\s/g);
                // Add last matching operator to calculation & number for displaying history
                // And add parenthesis if it is a negative number
                if(calculation.match(/^\-/) && number.match(/\-/))
                    display = '(' + calculation + ')' + match[match.length - 1] + '(' + number + ')';
                else if (calculation.match(/^\-/))
                    display = '(' + calculation + ')' + match[match.length - 1] + number;
                else if (number.match(/\-/))
                    display = calculation + match[match.length - 1] + '(' + number + ')';
                else
                    display = calculation + match[match.length - 1] + number;
                // If last operator is not a division operator in matching array, leave it as it is
                // If last operator is a division operator, replace it with a proper division operator for calculation purposes
                match[match.length - 1] = match[match.length - 1].match(/\s÷\s/g) === null ?
                                          match[match.length - 1]                          :
                                          match[match.length - 1].replace(/\s÷\s/, '/');
                // Same goes for multiplication
                // We leave addition & subtraction operatos as they are
                match[match.length - 1] = match[match.length - 1].match(/\s×\s/g) === null ?
                                          match[match.length - 1]                          :
                                          match[match.length - 1].replace(/\s×\s/, '*');
                // Evaluate expression
                calculation = eval(calculation + match[match.length - 1] + number).toFixed(8).toString().replace(/(\.0+|0+)$/, '');
                // Display
                if(calculation === 'Infinity' || calculation === '-Infinity')
                {
                    calculation            = '';
                    number                 = '';
                    display                = '';
                    bottomScreen.innerHTML = 'Undefined';
                }
                else
                {
                    bottomScreen.innerHTML = calculation;
                    historyData.addHistory(display + ' = ' + calculation, displayTime('history'));
                    // Show history delete-all button
                    document.getElementById('delete-history').style.display = 'block';
                    // Show history panel on small screens.
                    smallScreens();
                }
            }
        }
        // If previous value clicked is not equal...
        else
        {
            if(calculation !== '')
            {
                // To add parenthesis if last number is a negative one
                if(calculation.match(/[-+/*]-\d+$/))
                {
                    display = display.replace(/(-\d+$)/, '($1)');
                    calculation = calculation.replace(/(-\d+)$/, '($1)');
                }
                // Evaluate expression
                calculation = eval(calculation).toFixed(8).toString().replace(/(\.0+|0+)$/, '');
                if(calculation === 'Infinity' || calculation === '-Infinity')
                {
                    calculation            = '';
                    number                 = '';
                    display                = '';
                    bottomScreen.innerHTML = 'Undefined';
                }
                else
                {
                    topScreen.innerHTML = '';
                    bottomScreen.innerHTML = calculation;
                    historyData.addHistory(display + ' = ' + calculation, displayTime('history'));
                    // Show history delete-all button
                    document.getElementById('delete-history').style.display = 'block';
                    // Show history panel on small screens.
                    smallScreens();
                }
            }
        }
        previousOperation = 'Equal';
    }

    function factorial(n)
    {
        if(n === 0)
            return 1;
        else
        {
            return n * factorial(n - 1);
        }
    }

    switch(value)
    {
        case 'CA':
            calculation = '';
            display = '';
            number = '';
            bottomScreen.innerHTML = DEFAULT_VALUE;
            topScreen.innerHTML = '';
            previousOperation = 'Clear All';
            break;
        case '<span class="ion-backspace"></span>':
            if(previousOperation !== 'Equal')
            {
                if(number !== '')
                {
                    number = number.slice(0, -1);
                    calculation = calculation.slice(0, -1);
                    display = display.slice(0, -1);
                    bottomScreen.innerHTML = number;
                }
                if(number === '')
                    bottomScreen.innerHTML = DEFAULT_VALUE;
            }
            break;
        case '+/-':
            value = '';
            if(calculation !== '')
            {
                // To prevent adding minus sign to the previous number that was added already
                if(previousOperation === 'Basic Operation')
                    break;
                if(previousOperation === 'Equal'              ||
                   previousOperation === 'Negate'             ||
                   previousOperation === 'Factorial'          ||
                   previousOperation === 'Other Operations')
                {
                    display = 'negate(' + calculation + ')';
                    calculation = (-parseFloat(calculation)).toString();
                    number = calculation;
                    bottomScreen.innerHTML = calculation;
                    topScreen.innerHTML = display;
                }
                else
                {
                    var oppositeNumber = (-parseFloat(number)).toString();
                    // Replace last number in calculation
                    display = display.replace(/\d+(\.)?(\d+)?$/,  oppositeNumber);
                    calculation = calculation.replace(/\d+(\.)?(\d+)?$/, oppositeNumber);
                    number = oppositeNumber;
                    bottomScreen.innerHTML = number;
                }
            }
            previousOperation = 'Negate';
            break;
        case 'x<sup>2</sup>':
            otherOperations('sqr');
            break;
        case '√':
            otherOperations('√');
            break;
        case 'sin':
            otherOperations('sin');
            break;
        case 'cos':
            otherOperations('cos');
            break;
        case 'tan':
            otherOperations('tan');
            break;
        case 'n!':
            if(calculation !== '')
            {
                if(parseFloat(calculation) < 0 || parseFloat(calculation) !== parseInt(calculation, 10))
                {
                    calculation = '';
                    display = '';
                    number  = '';
                    bottomScreen.innerHTML = 'Invalid Input!';
                }
                else
                {
                    if(previousOperation === 'Equal' || previousOperation == 'Other Operations')
                    {
                        number = calculation;
                    }
                    display = eval(calculation).toString() + '!';
                    calculation = factorial(parseFloat(eval(calculation))).toFixed(8).toString().replace(/(\.0+|0+)$/, '');
                    topScreen.innerHTML = display;
                    bottomScreen.innerHTML = calculation;
                    previousOperation = 'Factorial';
                }
            }
            break;
        case '.':
            if(number !== '')
            {
                // To prevent more then one dot on number
                if(calculation.match(/\.$/) || calculation.match(/\d+\.\d+$/))
                    value = '';
                if(previousOperation === 'Basic Operation')
                    number = '';
                calculation += value;
                display += value;
                number += value;
                previousOperation = 'Dot';
                bottomScreen.innerHTML = number;
            }
            break;
        case 'π':
            value = (Math.PI).toFixed(8).toString();
            if(previousOperation === 'Equal' || previousOperation === 'Default')
            {
                calculation = '';
                display = '';
                number = '';
            }
            number = value;
            calculation += value;
            display += value;
            bottomScreen.innerHTML = number;
            previousOperation = 'PI';
            break;
        case '÷':
            basicOperations('/');
            break;
        case '×':
            basicOperations('*');
            break;
        case '+':
            basicOperations('+');
            break;
        case '-':
            basicOperations('-');
            break;
        case '=':
            if(previousOperation !== 'Basic Operation' || calculation.match(/^((-)?\d+)$/) !== null)
                calculate();
            break;
        default:
            if(value === '0')
            {
                if(number === '' || number.match(/^([1-9])/) || number.match(/^(0\.)/) || previousOperation === 'Basic Operation')
                {
                    value = '0';
                }
                else
                    value = '';
            }
            // To remove zero at the begining of the operand (033 --> 33)
            if(number.match(/^0\d+/))
            {
                number = number.replace(/^0/, '');
                calculation = calculation.replace(/^0/, '');
                display = display.replace(/^0/, '');
            }
            // To remove from any number starting zero if it has one (33 + 033 - 033 --> 33 + 33 - 33)
            if(calculation.match(/0\d+/))
            {
                calculation = calculation.replace(/0(\d+)/, '$1');
                display = display.replace(/0(\d+)/, '$1');
            }
            // For reseting number value after basic operation clicked
            if(previousOperation === 'Basic Operation')
                number = '';
            // For reseting everything after calculation if we click a number
            else if (previousOperation === 'Equal'              ||
                     previousOperation === 'Negate'             ||
                     previousOperation === 'Factorial'          ||
                     previousOperation === 'Other Operations')
            {
                if(previousOperation === 'Other Operations' || previousOperation === 'Square Root' || previousOperation === 'Factorial')
                    historyData.addHistory(display + ' = ' + calculation, displayTime('history'));
                calculation = '';
                display = '';
                number = '';
                topScreen.innerHTML = '';
            }
            calculation += value;
            display += value;
            number += value;
            previousOperation = 'Default';
            bottomScreen.innerHTML = number;
    }
}

