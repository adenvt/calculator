<template>
  <div class="main">
    <div class="calculator">
      <div class="calculator__display">
        <div class="text-xl text-right w-[200px]">
          {{ display }}
        </div>
      </div>
      <div class="calculator__keypad">
        <!-- Row 1 -->
        <button
          class="calculator__keypad-pad"
          @click="clear()">
          C
        </button>
        <button
          class="col-start-3 calculator__keypad-pad"
          @click="clearOne()">
          ←
        </button>
        <button
          class="calculator__keypad-pad"
          @click="onOperatorPressed('/')">
          ÷
        </button>
        <!-- Row 2  -->
        <button
          class="calculator__keypad-pad"
          @click="onKeypadPressed('7')">
          7
        </button>
        <button
          class="calculator__keypad-pad"
          @click="onKeypadPressed('8')">
          8
        </button>
        <button
          class="calculator__keypad-pad"
          @click="onKeypadPressed('9')">
          9
        </button>
        <button
          class="calculator__keypad-pad"
          @click="onOperatorPressed('*')">
          ×
        </button>
        <!-- Row 3 -->
        <button
          class="calculator__keypad-pad"
          @click="onKeypadPressed('4')">
          4
        </button>
        <button
          class="calculator__keypad-pad"
          @click="onKeypadPressed('5')">
          5
        </button>
        <button
          class="calculator__keypad-pad"
          @click="onKeypadPressed('6')">
          6
        </button>
        <button
          class="calculator__keypad-pad"
          @click="onOperatorPressed('-')">
          −
        </button>
        <!-- Row 4 -->
        <button
          class="calculator__keypad-pad"
          @click="onKeypadPressed('1')">
          1
        </button>
        <button
          class="calculator__keypad-pad"
          @click="onKeypadPressed('2')">
          2
        </button>
        <button
          class="calculator__keypad-pad"
          @click="onKeypadPressed('3')">
          3
        </button>
        <button
          class="calculator__keypad-pad"
          @click="onOperatorPressed('+')">
          +
        </button>
        <!-- Row5 -->
        <button
          class="calculator__keypad-pad"
          @click="onKeypadPressed('0')">
          0
        </button>
        <button
          class="calculator__keypad-pad"
          @click="toggleMinus()">
          ±
        </button>
        <button
          class="calculator__keypad-pad"
          @click="addDecimal()">
          .
        </button>
        <button
          class="calculator__keypad-pad"
          @click="equal()">
          =
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  onUnmounted,
  ref,
  computed,
} from 'vue'
import type { Operation } from './utils'
import {
  calculate,
  isOperation,
  toDisplay,
} from './utils'

const MAX_CHAR = 15

const display = ref('0')
const lastKey = ref('')

const operator = ref<Operation>()
const valueA   = ref<number>()
const valueB   = ref<number>()

const isShouldReset = computed(() => {
  return isOperation(lastKey.value) || lastKey.value === '='
})

function onKeypadPressed (key: string) {
  if ((display.value === '0' && key !== '.') || isShouldReset.value) {
    if (lastKey.value === '=') {
      valueA.value = undefined
      valueB.value = undefined
    }

    display.value = key
    lastKey.value = key
  } else if (display.value.length < MAX_CHAR) {
    display.value = `${display.value}${key}`
    lastKey.value = key
  }
}

function equal () {
  if (operator.value && valueA.value !== undefined && !isOperation(lastKey.value)) {
    valueB.value = lastKey.value === '=' ? valueB.value : Number.parseFloat(display.value)
    valueA.value = calculate(operator.value, valueA.value, valueB.value as number)

    display.value = toDisplay(valueA.value, MAX_CHAR)
    lastKey.value = '='
  }
}

function onOperatorPressed (key: Operation) {
  if (display.value) {
    if (!isOperation(lastKey.value)) {
      if (valueA.value === undefined || lastKey.value === '=')
        valueA.value = Number.parseFloat(display.value)
      else
        equal()
    }

    operator.value = key
    lastKey.value  = key
  }
}

function addDecimal () {
  if (display.value && !display.value.includes('.') && !isShouldReset.value)
    onKeypadPressed('.')
}

function toggleMinus () {
  if (display.value && !isShouldReset.value) {
    display.value = display.value.startsWith('-') ? display.value.slice(1) : `-${display.value}`
    lastKey.value = '±'
  }
}

function clear () {
  display.value  = '0'
  lastKey.value  = ''
  operator.value = undefined
  valueA.value   = undefined
  valueB.value   = undefined
}

function clearOne () {
  if (display.value) {
    display.value = isShouldReset.value || display.value.length <= 1 || (display.value.startsWith('-') && display.value.length === 2)
      ? '0'
      : display.value.slice(0, -1)
  }
}

function onKeyboard (event: KeyboardEvent) {
  switch (event.key) {
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9': {
      onKeypadPressed(event.key)
      break
    }

    case '+':
    case '-':
    case '*':
    case '/': {
      onOperatorPressed(event.key)
      break
    }

    case '.': {
      addDecimal()
      break
    }

    case 'Enter':
    case '=': {
      equal()
      break
    }

    case 'Backspace': {
      clearOne()
      break
    }

    default: {
      break
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyboard, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyboard)
})
</script>

<style lang="postcss">
.main {
  @apply flex flex-col items-center justify-center h-full min-h-screen bg-retro-500 font-body text-retro-800 space-y-4;
}

.calculator {
  @apply border-2 border-retro-800 flex flex-col p-4 space-y-4 rounded;

  &__display {
    @apply h-14 bg-retro-800 text-retro-500 flex flex-col items-end justify-center py-2 px-4 w-full overflow-hidden;
  }

  &__keypad {
    @apply grid grid-cols-4 grid-rows-5 gap-2 touch-manipulation;

    &-pad {
      @apply p-2 border-2 border-retro flex items-center justify-center text-xl rounded;

      &:hover,
      &:active,
      &.active {
        @apply bg-retro-800 text-retro-500;
      }
    }
  }
}
</style>
