<script setup lang="ts">
// Add SEO meta tags
useSeoMeta({
  title: 'Tic Tac Toe with AI - Beat the Bot!',
  description: 'Play Tic Tac Toe against a smart AI opponent. Can you win? Free, fun, and engaging game for all!',
  ogTitle: 'Tic Tac Toe with AI - Play Now!',
  ogDescription: 'Challenge yourself in a classic Tic Tac Toe game against an AI opponent. Try it for free!',
  ogImage: '/tic-tac-toe-ai-preview.jpg',
  // ogUrl: 'https://example.com/tic-tac-toe',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Tic Tac Toe with AI',
  twitterDescription: 'Enjoy the classic Tic Tac Toe game with a smart AI twist!',
  // twitterImage: '/tic-tac-toe-ai-preview.jpg',
  keywords: 'Tic Tac Toe, Play Tic Tac Toe, AI Tic Tac Toe, Strategy Game, Fun Games',
});

// State management
const currentUser = ref<Player>(null);
const gameBoard = ref<Board>(initializeBoardState());
const isGameOver = ref(checkGameOver(gameBoard.value));
const currentPlayer = ref(determineCurrentPlayer(gameBoard.value));
const isAIProcessing = ref(false);
const winningPlayer = ref(getWinningDetails(gameBoard.value)[0]);
const winningMoves = ref(getWinningDetails(gameBoard.value)[1]);

// AI Move Handler
const executeAIMove = async () => {
  if (currentUser.value && currentUser.value !== currentPlayer.value && !isGameOver.value) {
    isAIProcessing.value = true;
    await simulateDelay(900);
    const aiMove = calculateBestMove(gameBoard.value);
    if (aiMove) {
      gameBoard.value = applyMove(gameBoard.value, aiMove);
    }
    isAIProcessing.value = false;
  }
};

// Watchers
watch([currentUser, currentPlayer], () => {
  executeAIMove();
});

watch(gameBoard, () => {
  isGameOver.value = checkGameOver(gameBoard.value);
  currentPlayer.value = determineCurrentPlayer(gameBoard.value);
});

watch(isGameOver, () => {
  if (isGameOver.value) {
    const [winner, winningSequence] = getWinningDetails(gameBoard.value);
    winningPlayer.value = winner;
    winningMoves.value = winningSequence;
  }
});

// User Move Handler
const handlePlayerMove = (row: number, col: number) => {
  if (currentUser.value === currentPlayer.value && !isGameOver.value) {
    if (gameBoard.value[row][col] === EMPTY) {
      gameBoard.value = applyMove(gameBoard.value, [row, col]);
    }
  }
};

// Reset Game Handler
const resetGame = () => {
  currentUser.value = null;
  gameBoard.value = initializeBoardState();
};
</script>

<template>
  <div class="fixed h-screen w-full">
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div v-if="!currentUser" class="flex flex-col items-center gap-2">
        <div class="w-full">
          <h1 class="font-bold">
            <PlayAsLabel />
          </h1>
        </div>
        <div class="flex gap-4">
          <XMarkCell @click="currentUser = X" role="button" class="transition-opacity duration-300ms X" />
          <OMarkCell @click="currentUser = O" role="button" class="transition-opacity duration-300ms O" />
        </div>
      </div>

      <div v-else class="flex flex-col items-center gap-2">
        <div class="grid grid-cols-3 gap-2 w-full">
          <div class="col-span-2">
            <div class="flex gap-2 items-center">
              <h1>
                <TieLabel v-if="isGameOver && !winningPlayer" />
                <XLabel v-else-if="(!isGameOver && currentPlayer === X) || (isGameOver && winningPlayer === X)" />
                <OLabel v-else-if="(!isGameOver && currentPlayer === O) || (isGameOver && winningPlayer === O)" />
              </h1>
              <h1 v-if="isGameOver" class="font-bold text-xs">
                <WinMessage v-if="isGameOver && winningPlayer" />
                <TieMessage v-else="isGameOver && !winningPlayer" />
              </h1>
              <div class="h-[8px]">
                <ProcessingDots v-if="isAIProcessing" />
              </div>
            </div>
          </div>
          <div class="col-span-1 justify-self-end">
            <ResetButton @click="resetGame" role="button" v-if="isGameOver" />
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2">
          <div v-for="(_, rowIndex) in 3" :key="rowIndex" class="grid grid-rows-3 gap-2">
            <div v-for="(_, colIndex) in 3" :key="colIndex">
              <XMarkCell v-if="gameBoard[rowIndex][colIndex] === X" role="button"
                class="transition-opacity duration-300ms"
                :class="{ 'opacity-50': isGameOver && !winningMoves.some(([x, y]) => x === rowIndex && y === colIndex) }" />
              <OMarkCell v-else-if="gameBoard[rowIndex][colIndex] === O" role="button"
                class="transition-opacity duration-300ms"
                :class="{ 'opacity-50': isGameOver && !winningMoves.some(([x, y]) => x === rowIndex && y === colIndex) }" />
              <EmptyCell @click="handlePlayerMove(rowIndex, colIndex)" v-else role="button" class="opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
div:has(> .X:hover)>.O,
div:has(> .O:hover)>.X {
  @apply opacity-50;
}
</style>
