"use strict";

$.getJSON('../assets/tasklist.json', tasklist => {

const $planAll = $('#plan-all')
const $planSelected = $('#plan-selected')
    
const updateSelectedCostSum = () => 
    $('#plan-cost .num').text(
        $('#plan-selected .plan-item .cost .num')
            .map((_, e) => +e.textContent || 0)
            .get().reduce((acc, val) => acc + val, 0)
    )

const $tagSorter = $('#tag-sorter')
const allTags = [...new Set(tasklist.flatMap(task => task.tags))]

const sortPlanAllByTags = () => {
    let blacklist = [], whitelist = []

    $tagSorter.find('.tag').each(function () {
        const tag = $(this).attr('tag')
        const state = $(this).find('input').prop('state')
        if (state == 1) whitelist.push(tag)
        if (state == 2) blacklist.push(tag)
    })

    console.log(whitelist, blacklist)

    $('#plan-all .plan-item').each(function () {
        const tags = $(this).find('.tags .tag').map((_, i) => $(i).attr('tag')).get()
        const isNotBlacklisted = !tags.some(tag => blacklist.includes(tag));
        const matchesWhitelist = whitelist.length === 0 || tags.some(tag => whitelist.includes(tag));
        $(this).toggle(isNotBlacklisted && matchesWhitelist);
    })
}

$tagSorter.append(allTags.map(tag => {
    const $checkbox = $('<input type="checkbox">')
    .each(function() {this.state = 0})
    .on('change', function() {
        this.state = (this.state + 1) % 3
        this.checked = (this.state == 1)
        this.indeterminate = (this.state == 2)
        sortPlanAllByTags()
    })
    
    return $('<label>').addClass('tag').attr('tag', tag)
        .append($checkbox, $('<span>').text(tag))
}))

// horizontal scroll
$tagSorter.on('wheel', function(event) {
    const origEvent = event.originalEvent
    if (this.scrollWidth > this.clientWidth) {
        origEvent.preventDefault()
        this.scrollLeft += origEvent.deltaY
    }
})

tasklist.forEach(item => {
    /*
     * Content
     */

    const $div = $('<div>').addClass('plan-item')

    const $content = $('<div>').addClass('content').append(
        $('<h3>').text(item.name),
        $('<p>').text(item.description),
        $('<section>').addClass('tags').append(
            item.tags.map(tag =>
                $('<div>').addClass('tag').attr('tag', tag).text(tag))
        )
    )
    const $cost = $('<span>').text(item.cost).addClass('num')
    const $count = $('<span>').addClass('count').text('1')
    const updateCost = () => $cost.text(item.cost * +$count.text())
    
    const $minus = $('<button>').addClass('minus').on('click', () => {
        let count = +$count.text()
        if (count > 1) $count.text(count - 1)
        updateCost()
        updateSelectedCostSum()
    })
    const $plus = $('<button>').addClass('plus').on('click', () => {
        let count = +$count.text()
        if (count < 100) $count.text(count + 1)
        updateCost()
        updateSelectedCostSum()
    })
    
    $content.append(
        $('<section>').addClass('cost').append(
            $cost,
            $('<span>').text('Количество: '),
            $('<div>').addClass('countControl')
                .append($minus, $count, $plus)
        )
    )

    /*
     * Controls
     */

    const $control = $('<div>').addClass('control')

    const $up = $('<button>').addClass('up')
        .on('click', () => $div.prev().before($div))
    
    const $down = $('<button>').addClass('down')
        .on('click', () => $div.next().after($div))
    
    const $add = $('<button>').addClass('add')
        .attr('pos', 'add')
        .on('click', () => {
        const isAdd = $add.attr('pos') == 'add';
        $add.attr('pos', isAdd ? 'remove' : 'add');
        (isAdd ? $planSelected : $planAll).prepend($div);
        updateSelectedCostSum()    
    })

    $control.append($up, $down, $add)

    /*
     * Final
     */

    $div.append($content, $control)

    $planAll.append($div)
})

}) // end getJSON