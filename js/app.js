/*esversion:6'*/
this.onload = function() {

    displayTime('calculator');
    events();

    setInterval(function() {
        displayTime('calculator');
    }, 1000);
};


// Global variables
var number = '',
    display = '',
    calculation = '',
    previousOperation = '',
    match;
const DEFAULT_VALUE = '0';
// constant for matching devices with width smaller than 730px
const MEDIA_QUERIE = window.matchMedia( "(max-width: 729px)" );

function displayTime(where)
{
    var date = document.getElementById('date'),
        clock = document.getElementById('time'),
        currentTime = new Date();

    if(where === 'history')
    {
        return function() {
            var hour = this.getHours().toString(),
                minutes = this.getMinutes().toString();
           return hour + ':' + (minutes.length === 1 ? '0' + minutes : minutes);
        }.call(currentTime);
    }
    else if(where === 'calculator')
    {
        return function() {
            var re = /^(\w+)\s(\w+\s\d+)\s\d+$/;
            clock.innerHTML = '<p>' + this.toLocaleTimeString() + '</p>';
            date.innerHTML = '<p>' + this.toDateString().replace(re, '$1, $2') + '</p>';
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
        historyUl.innerHTML = '';
        this.history.forEach(function(history, position)
        {
            var historyLi = document.createElement('li');
            historyLi.id = position;
            historyLi.innerHTML = '<div class="history-text"><span class="time"><span class="ion-ios-clock-outline"></span>' + ' ' + history.time + '</span>' + 
                                  '<p class="history">' + history.calculation + '</p></div>' + 
                                  '<div class="remove"><span class="ion-ios-trash-outline"></span></div>';
            historyUl.appendChild(historyLi);
        }, this);
    },
    deleteButton: function()
    {
        var button = document.createElement('button');
    }
};

// DOM events
function events()
{
    // Array of buttons
    var buttons = document.querySelectorAll('button'),
        deleteHistoryButton = document.getElementById('delete-history'),
        historyUl = document.querySelector('ul');

    // IIFE for keyboard press
    (function (buttons)
    {
        document.addEventListener('keydown', function(e)
        {
            // Bind pressed key with data-key attribute on each button
            var button = document.querySelector('button[data-key="' + e.key + '"]'),
                value;
            if(button) {
                // Add class for transition effect
                button.classList.add('keypress');
                value = button.innerHTML;
                // Call buttonHandlers function to 'deal' with button value
                buttonValueHandler(value);
            }
            buttons.forEach(function(button)
            {
                // Remove keypress class after transition ends
                button.addEventListener('transitionend', function(e) {
                    this.classList.remove('keypress');
                });
            });
        });
    })(buttons);

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
                    // Remove whole history tab
                    if(MEDIA_QUERIE.matches)
                    {
                        document.getElementById('history').style.display = 'none';
                    }
                    // Remove only the trash
                    else
                    {
                        document.getElementById('delete-history').style.display = 'none';
                    }
                }
            }
        });
    })(historyUl);
}


// To set zero at bottom screen 
document.getElementById('bottom-calculation').innerHTML = DEFAULT_VALUE;



// For handling calculator button clicks
function buttonValueHandler(value)
{
    var topScreen = document.getElementById('top-calculation'),
        bottomScreen = document.getElementById('bottom-calculation'),
        history = document.getElementById('history');

    // Function for showing history tab on screens smaller than 730px
    function smallScreens()
    {
        if(MEDIA_QUERIE.matches)
        {
        history.style.display = 'block';
        }
    }

    function basicOperations(operator)
    {
        if(number !== '')
        {
            // If previous value is equal, we didnt press any number
            // so we continue with previous result as the first parameter of calculation
            if(previousOperation === 'Equal')
            {
                display = calculation;
                display = display + ' ' + value + ' ';
                calculation += operator;
            }
            // To prevent from adding more than one operator 
            if(calculation.match(/([-+/*^])$/) !== null)
            {
                display = display.replace(/\s[-+÷×^]\s$/, ' ' + value + ' ');
                calculation = calculation.replace(/[-+/*^]$/, operator);
            }
            // Normal case
            else
            {
                display = display +  ' ' + value + ' ';
                calculation += operator;
            }
            topScreen.innerHTML = display;
            previousOperation = 'Basic Operation';
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
                {
                    bottomScreen.innerHTML = DEFAULT_VALUE;
                }
            }
            break;
        case '+/-':

            break;
        case 'x<sup>y</sup>':
            basicOperations('^');

            break;
        case '√':

            break;
        case 'sin':
            
            break;
        case 'cos':
            
            break;
        case '(...)':

            break;
        case '.':

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
            if(calculation.match(/([-+/*])$/) !== null)
            {
                // To remove operator from string that is a last character in strings if it exists (2+2+) --> 2+2
                calculation = calculation.replace(/([-+/*])$/, '');
                display = display.replace(/\s[-+÷×]\s$/, '');
            }
            // For continuously clicking equal operator --> Repeat last operation with result & last operand
            if(previousOperation === 'Equal')
            {
                // Find matching operators --> Result is an array of matching operators
                match = display.match(/\s([-+÷×])\s/g);
                // Add last matching operator to calculation & number for displaying history
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
                bottomScreen.innerHTML = calculation;
                historyData.addHistory(display + ' = ' + calculation, displayTime('history'));
                // Show history delete-all button
                document.getElementById('delete-history').style.display = 'block';
                // Show history panel on small screens.
                smallScreens();
            }
            // If previous value clicked is not equal...
            else
            {
                if(calculation !== '')
                {
                    // Evaluate expression
                    calculation = eval(calculation).toFixed(8).toString().replace(/(\.0+|0+)$/, '');
                    topScreen.innerHTML = '';
                    bottomScreen.innerHTML = calculation;
                    historyData.addHistory(display + ' = ' + calculation, displayTime('history'));
                    // Show history delete-all button
                    document.getElementById('delete-history').style.display = 'block';
                    smallScreens();
                }
            }
            previousOperation = 'Equal';
            break;
        default:
            // For reseting number value after basic operation clicked
            if(previousOperation === 'Basic Operation')
            {
                number = '';
            }
            // For reseting everything after calculation if we click a number
            else if (previousOperation === 'Equal')
            {
                calculation = '';
                display = '';
                number = '';
            }
            calculation += value;
            display += value;
            number += value;
            previousOperation = 'Default';
            bottomScreen.innerHTML = number;
    }
}

