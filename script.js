// audio sound 
const uwuPlay = new Audio('./public/audios/audio-uwu.mp3')

// features buttons 
document.querySelector('.uwu-button').addEventListener('click', () => {
  uwuPlay.currentTime = 0
  uwuPlay.play()
})

document.querySelector('.full-screen-button').addEventListener('click', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.body.requestFullscreen()
  }
})


// calculator button
let inputBox = document.querySelector('input')    // input box 
let firstNumValue = ''   //to check is first value is operator or dot or any other non numeric value? 
let isOpenParenthesisAvailable = false      // check is there any open parenthesis is avalaible or not
let isNumberValueAvailable = false
let result = ''
let resultPanel = document.querySelector('.result-panel')
const buttons = document.querySelectorAll('button')
let openParenthesis = false
let closeParenthesis = false
let numbersContainDot = false
let numbersContainOperator = false
let isThemeBlack = true
const bodyElement = document.body
const themeButton = document.querySelector('.theme-switch-button')
let lastNumberValue = false

// Helper function to insert text at cursor position
function insertAtCursor(text) {
  const start = inputBox.selectionStart
  const end = inputBox.selectionEnd
  const currentValue = inputBox.value

  // Insert text at cursor position, replacing any selected text
  inputBox.value = currentValue.substring(0, start) + text + currentValue.substring(end)

  // Set cursor position after the inserted text
  const newCursorPos = start + text.length
  inputBox.setSelectionRange(newCursorPos, newCursorPos)

  // Focus the input box to maintain cursor position
  inputBox.focus()
}


for (const index in buttons) {
  if (!Object.hasOwn(buttons, index)) continue;

  const button = buttons[index];
  button.addEventListener('click', () => {

    if (button.id === 'clear') {
      inputBox.value = ''
      resultPanel.textContent = ''
      isNumberValueAvailable = false
    }

    else if (button.id === 'parenthesis') {
      if (!isOpenParenthesisAvailable) {
        insertAtCursor('(')
        isOpenParenthesisAvailable = true
        openParenthesis = true
      } else if (isNumberValueAvailable && closeParenthesis) {
        insertAtCursor(')')
        isOpenParenthesisAvailable = false
        closeParenthesis = false
        openParenthesis = false
      }
    }

    else if (button.id === 'backspace') {
      const start = inputBox.selectionStart
      const end = inputBox.selectionEnd
      const currentValue = inputBox.value

      if (start !== end) {
        // If text is selected, delete the selection
        inputBox.value = currentValue.substring(0, start) + currentValue.substring(end)
        inputBox.setSelectionRange(start, start)
      } else if (start > 0) {
        // Delete character before cursor
        inputBox.value = currentValue.substring(0, start - 1) + currentValue.substring(start)
        inputBox.setSelectionRange(start - 1, start - 1)
      }

      inputBox.focus()
    }

    else if (button.id === 'equal') {
      // Check if input panel is not empty before evaluating
      if (inputBox.value.trim()) {
        let percentage = null
        // check is there any % if yes then make it work as Percent
        if(lastNumberValue) {
          percentage = '*(1/100)*'
        }
        else {
          percentage = '*(1/100)'
        }

        if(inputBox.value.includes('%')) inputBox.value = inputBox.value.replaceAll('%', percentage)
        resultPanel.textContent = eval(inputBox.value)
        inputBox.value = ''
      }
    }

    else if (button.classList[0] === 'operator' && isNumberValueAvailable && inputBox.value && !numbersContainOperator) {
      insertAtCursor(button.value)
      numbersContainOperator = true
      numbersContainDot = false
      lastNumberValue = false
    }

    else if (button.className === 'dot-button' && isNumberValueAvailable && !numbersContainDot) {
      insertAtCursor(button.value)
      numbersContainDot = true
      lastNumberValue = false
    }

    else if (button.classList[0] === 'number') {
      insertAtCursor(button.value)
      lastNumberValue = true
      isNumberValueAvailable = true
      numbersContainOperator = false
      if (openParenthesis) {
        closeParenthesis = true
      }
    }

  })
}

document.querySelector('.result-panel').addEventListener('click', () => {
  if (resultPanel.textContent) {
    inputBox.value = resultPanel.textContent
    // Set cursor position at the end of the text
    const length = inputBox.value.length
    inputBox.setSelectionRange(length, length)
    inputBox.focus()
  }
})

document.querySelector('.theme-switch-button').addEventListener('click', () => {
  if (bodyElement.classList.contains('light-mode')) {
    bodyElement.classList.remove('light-mode')
    themeButton.classList.remove('theme-switch-button-light-mode')
    localStorage.setItem('theme', 'dark')
  } else {
    bodyElement.classList.add('light-mode')
    themeButton.classList.add('theme-switch-button-light-mode')
    localStorage.setItem('theme', 'light')
  }
})

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    bodyElement.classList.remove('light-mode')
    themeButton.classList.remove('theme-switch-button-light-mode')
  } else if (savedTheme === 'light') {
    bodyElement.classList.add('light-mode')
    themeButton.classList.add('theme-switch-button-light-mode')
  }
})