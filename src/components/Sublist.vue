<template>
    <div style="margin-top: 10px;">
        <h3><slot name="title"></slot></h3>
        <div>
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
h3{
    color: var(--text-2);
    margin: 5px;
    padding: 0 5px;
    font-weight: 600;
}
</style>
