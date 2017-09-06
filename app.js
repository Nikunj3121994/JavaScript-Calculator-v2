'esversion:6';
this.onload = function() {

    displayTime('calculator');
    events();

    setInterval(function() {
        displayTime('calculator');
    }, 1000);
};


function displayTime(where)
{
    var date = document.getElementById('date'),
        clock = document.getElementById('time'),
        currentTime = new Date();

    if(where === 'history')
    {
        return function() {
            //something
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



var calculationData =
{
    numbers: [],
    addNumber: function(number, operator)
    {
        this.numbers.push({
            value: number,
            operation: operator || null
        });
    },
    clearNumbers: function()
    {
        this.numbers = [];
    },
    calculate: function()
    {

    }
};

var historyData =
{
    history: [],
    addHistory: function(number, calculation)
    {
        this.history.push({
            number: number,
            calculation: calculation
        });
    },
    displayHistory: function()
    {
        var historyUl = document.querySelector('ul');
        historyUl.innerHTML = '';
        this.history.forEach(function(history, position)
        {
            var historyLi = document.createElement('li');
            historyLi.id = position;
            historyLi.textContent = history.calculation;
            historyUl.appendChild(historyLi);
        }, this);
    }
};

function events()
{
    // Array of buttons
    var buttons = document.querySelectorAll('button');

    // IIFE for keyboard press
    (function (buttons)
    {
        document.addEventListener('keydown', function(e)
        {
            var button = document.querySelector('button[data-key="' + e.key + '"]'),
                value;
            if(button) {
                // Add class for transition effect
                button.classList.add('keypress');
                value = button.innerHTML;
                // Call buttonHandlers function to 'deal' with button value
                console.log(value);
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
}

// Global variables
var number = '',
    prevOperation = '',
    defaultValue = '0';

// To set zero at starting point
document.getElementById('bottom-calculation').innerHTML = defaultValue;


function buttonValueHandler(value)
{
    var topScreen = document.getElementById('top-calculation'),
        bottomScreen = document.getElementById('bottom-calculation');

    switch(value)
    {
        case 'CA':
            topScreen.innerHTML = '';
            bottomScreen.innerHTML = '';
            number = '';
            break;
        case '<span class="ion-backspace"></span>':
            number = number.slice(0, -1);
            bottomScreen.innerHTML = number;
            break;
        case '+/-':
            if(number.match(/\d+/) !== null)
            {
                var history = historyData.history;
                if(prevOperation === 'negate' && parseFloat(number) === -parseFloat(history[history.length - 1].number))
                {
                    historyData.addHistory(number.toString() ,'negate(' + history[history.length - 1].calculation + ')');
                }
                else
                {
                    historyData.addHistory(number.toString() ,'negate(' + number + ')');
                }
                number = (-parseFloat(number)).toString();
                bottomScreen.innerHTML = number;
                historyData.displayHistory();
                prevOperation = 'negate';
            }
            break;
        case 'x<sup>y</sup>':
            value = '^';
            if(number.match(/\d+/) !== null)
            {
                calculationData.addNumber(number, 'power');
                topScreen.innerHTML = number + value;
                number = '';
                prevOperation = 'power';
            }

            break;
        case '÷':
            value = '/';
            break;

        case '=':

            break;
        default:
            number  += value;
            bottomScreen.innerHTML = number;
    }
    // To set zero value on bottom screen if any other values are not present
    if(number === '')
    {
        bottomScreen.innerHTML = defaultValue;
    }
}





