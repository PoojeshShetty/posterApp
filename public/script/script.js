
var toggle = document.getElementById('toggle')
var sidebar = document.getElementById('sidebar')
var sidebar__options = document.getElementById('sidebar__options')

toggle.addEventListener('click', ()=> sidebar.classList.toggle('show__sidebar'))
sidebar__options.addEventListener('click', ()=> sidebar.classList.remove('show__sidebar'))