const $img = $('#koleso');
let angle = 0;
let animationFrameId = null;


function spin() {
    angle += 2
    $img.css('transform', `rotate(${angle}deg)`)
    animationFrameId = requestAnimationFrame(spin)
}


$img.on('mouseenter', function() {
    $img.css('transition', 'transform 0.1s linear');
    spin()
})

$img.on('mouseleave', function() {
    cancelAnimationFrame(animationFrameId)
    $img.css({
        'transition': 'transform 0.6s ease-out',
        'transform': 'rotate(0deg)'
    })
    angle = 0
})
