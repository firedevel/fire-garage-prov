<template>
  <div class="box-obj">
    <div class="icon"><slot name="icon"></slot></div>
    <div class="content">
        <h3><slot name="title"></slot></h3>
        <p><slot></slot></p>
    </div>
    <div class="right"><slot name="right"></slot></div>
  </div>
</template>

<style scoped>
.box-obj {
    display: grid;
    grid-template-columns: 40px 1fr auto;
    background-color: var(--bg);
    border-bottom: 1px solid;
    border-image: linear-gradient(90deg, #00000000 55px,var(--border) 55px, var(--border)) 1;
    padding: 10px;
    transition: all 0.2s;
    align-items: center;
    color: var(--text-1);
}
.box-obj[noicon]{
    grid-template-columns: 1fr auto;
    border-image: linear-gradient(90deg, #00000000 15px,var(--border) 15px, var(--border)) 1;
}
.box-obj[noicon] > .icon{
    display: none;
}
.box-obj:active{
    background-color: var(--bg-active);
}
.box-obj:first-child{
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}
.box-obj:last-child{
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    border: none;
}
.box-obj.box-add > *{
    color: var(--high-light);
}
h3{
    margin: 0;
    font-weight: 500;
}
p{
    margin: 0;
    color: var(--text-2);
}
.content{
    padding: 0 10px;
}
.box-obj > .arrow{
    width: 1em;
    height: 1em;
    vertical-align: middle;
    fill: currentColor;
    overflow: hidden;
}

.box-obj > .icon{
    display: flex;
    justify-content: center;
    padding: 5px;
}
.right{
    display: flex;
    height: 20px;
    gap: 5px;
}

.box-obj[cright] > .right{
    height: auto;
    display: block;
}
</style>
<style>
</style>