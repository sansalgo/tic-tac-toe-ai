<template>
    <svg width="28" height="7" viewBox="0 0 28 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse class="dot1" cx="3.48333" cy="3.48333" rx="3.48333" ry="3.48333" fill="currentColor" />
        <ellipse class="dot2" cx="13.75" cy="3.48333" rx="3.48333" ry="3.48333" fill="currentColor" />
        <ellipse class="dot3" cx="24.0167" cy="3.48333" rx="3.48333" ry="3.48333" fill="currentColor" />
    </svg>
</template>

<style>
@keyframes dotAnimation {

    0%,
    100% {
        opacity: 1;
    }

    25%,
    75% {
        opacity: 0.5;
    }
}

.dot1 {
    animation: dotAnimation 0.75s infinite;
}

.dot2 {
    animation: dotAnimation 0.75s infinite 0.25s;
}

.dot3 {
    animation: dotAnimation 0.75s infinite 0.5s;
}
</style>
