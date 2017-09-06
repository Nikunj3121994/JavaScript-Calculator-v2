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



var calculationData =
{
    numbers: [],
    addNumber: function(number, operator)
    {
        this.numbers.push({
            value: number,
            operator: operator || null
        });
    },
    clearNumbers: function()
    {
        this.numbers = [];
    },
    update: function(result)
    {
        this.numbers[0].value = result;
    },
    prevOperation: '',
    calculate: function()
    {
        var operator = this.numbers[0].operator,
            firstNumber = this.numbers[0].value,
            secondNumber = this.numbers[1].value || null,
            that = this,
            result;

        function operation(operator, result, operation) {
            historyData.addHistory(firstNumber.toString() + ' ' + operator + ' ' + secondNumber.toString() + ' = ' + result.toString(), displayTime('history'));
            that.update(result.toString());
            that.displayCalculation(result);
            that.prevOperation = operation;
            historyData.displayHistory();
        }

        switch(operator)
        {
            case 'power':
                result = Math.pow(parseFloat(firstNumber), parseFloat(secondNumber));
                operation('^', result, 'power');
                break;
            case 'division':
                result = parseFloat(firstNumber / secondNumber);
                operation('÷', result, 'division');
                break;
            case 'multiplication':
                result = parseFloat(firstNumber * secondNumber);
                operation('×', result, 'multiplication');
                break;
            case 'addition':
                result = parseFloat(firstNumber + secondNumber);
                operation('+', result, 'addition');
                break;
            case 'subtraction':
                result = parseFloat(firstNumber - secondNumber);
                operation('-', result, 'subtraction');
                break;
        }

    },
    displayCalculation: function(result)
    {
        var topScreen = document.getElementById('top-calculation'),
            bottomScreen = document.getElementById('bottom-calculation');

        topScreen.innerHTML = '';
        bottomScreen.innerHTML = result;
    }
};

var historyData =
{
    history: [],
    addHistory: function(calculation, time)
    {
        this.history.push({
            calculation: calculation,
            time: time
        });
    },
    removeOne: function(position) {
        this.history.splice(position, 1);
    },
    removeAll: function() {
        this.history = [];
    },
    displayHistory: function()
    {
        var historyUl = document.querySelector('ul');
        historyUl.innerHTML = '';
        this.history.forEach(function(history, position)
        {
            var historyLi = document.createElement('li');
            historyLi.id = position;
            historyLi.textContent = history.time + ' | ' + history.calculation;
            historyUl.appendChild(historyLi);
        }, this);
    },
    deleteButton: function() 
    {
        var button = document.createElement('button');
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
    defaultValue = '0',
    prevClick;

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
            calculationData.clearNumbers();
            prevClick = 'clearAll';
            break;
        case '<span class="ion-backspace"></span>':
            number = number.slice(0, -1);
            bottomScreen.innerHTML = number;
            break;
        case '+/-':
            if(number.match(/\d+/) !== null)
            {
                prevClick = 'negate';
            }
            break;
        case 'x<sup>y</sup>':
            value = '^';
            if(number.match(/\d+/) !== null)
            {
                calculationData.addNumber(number, 'power');
                topScreen.innerHTML = number + ' ' + value;
                number = '';
                prevClick = 'power';
            }
            break;
        case '÷':
            value = '/';
            if(number.match(/\d+/) !== null && calculationData.numbers.length === 0)
            {
                calculationData.addNumber(number, 'division');
                topScreen.innerHTML = number + ' ' + value;
                number = '';
                prevClick = 'division';
            }
            break;

        case '=':
            calculationData.addNumber(number);
            calculationData.calculate();
            number = '';
            prevClick = 'result';
            break;
        default:
            if(prevClick === 'result')
            {
                calculationData.clearNumbers();
            }
            number  += value;
            bottomScreen.innerHTML = number;
    }
}





