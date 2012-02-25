var checkKeyboard = function(){
    //Try and bind these keys in a loop, lots of duplication here
    //Couldn't get it to work previously.

    var k = settings.keyboard.movement;

    if (keyboard.pressed(k.forwards)){
        updatePos(playerdata, 'z', -1);
    }
    if (keyboard.pressed(k.left)){
        updatePos(playerdata, 'x', -1);
    }
    if (keyboard.pressed(k.back)){
        updatePos(playerdata, 'z', 1);
    }
    if (keyboard.pressed(k.right)){
        updatePos(playerdata, 'x', 1);
    }
    if (keyboard.pressed(settings.keyboard.jump.up)){
        var p = playerdata.arrayPosition;
        //Check if there's a block underneath before letting the player jump
        if(flying || (p.y === 0 || world[p.y - 1][p.x].charAt(p.z) !== '0')){
            updatePos(playerdata, 'y', 1);
        }
    }
    if (keyboard.pressed(settings.keyboard.jump.down)){
        updatePos(playerdata, 'y', -1);
    }
};

var bindInputs = function(){
    //Bind keys that perform a distinct action.
    //Control keys for player movement need more precise control

    $.getJSON('settings.json', function(data){
        settings = data;

        key(data.keyboard.misc.pause, function(){ paused = !paused; });
        key(data.keyboard.fly, function(){ flying = !flying; });
        key(data.keyboard.misc.mute, function(){ music.muted = !music.muted; });
    });
};