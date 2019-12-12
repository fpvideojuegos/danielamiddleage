import BasicScene from "./BasicScene.js";
import GameConstants from "../services/GameConstants.js";


class Level2 extends BasicScene {
    constructor() {
        super({
            key: GameConstants.Levels.LEVEL2
        });
        this.target = GameConstants.Levels.LEVEL3;
    }

    preload() {
        this.scene.launch('UI');
    }
    
    create() {
        //Daniela Creation
        this.createDaniela(GameConstants.Sprites.DanielaTroglo, false);
        //Background
        this.createRepeatedBackground(GameConstants.Textures.BG_LEVEL2, defaultStatus, defaultStatus,{x:1.25,y:1.25});
        //Finding enemies in json map
        this.findAndLoadEnemiesFromMap(GameConstants.Enemies_Layers.Level2);
        //ExtraPoints        
        this.createCoins();
        //HealthText
        this.createHealthText();
        //Tilemap
        this.paintLayerAndCreateCollision(GameConstants.Tiles.CASTLE);
        this.paintLayerAndCreateCollision(GameConstants.Tiles.CASTLE, 'Landscape', false);
        this.paintLayerAndCreateCollision(GameConstants.Tiles.CASTLE, 'Landscape2', false);

                //Objeto mapa
                let lastMap = {x: this.daniela.x, y: this.daniela.y};

        //PRIVATE SCENE ELEMENTS
        let wall =  this.paintLayerAndCreateCollision(GameConstants.Tiles.CASTLE, 'Wall');
        let wall2 =  this.paintLayerAndCreateCollision(GameConstants.Tiles.CASTLE, 'Wall2');
        this.findTransparentObjects(GameConstants.Layers.LIMITS, GameConstants.Sprites.Limit.KEY, false, true);
        
        //MUSIC and AUDIOS
        this.audioLevel2_LOLO_LookWhatIHaveFound_13 = this.sound.add(this.TG.getActualLang() + "_" + GameConstants.Sound.LEVEL2.LOLO_ANSWER);
        this.addEventForMusic(this.audioLevel2_LOLO_LookWhatIHaveFound_13);
        this.audioLevel2_LOLO_YouHaveToFindTheLever_15 = this.sound.add(this.TG.getActualLang() + "_" + GameConstants.Sound.LEVEL2.LOLO_TASK);
        this.addEventForMusic(this.audioLevel2_LOLO_YouHaveToFindTheLever_15,false,10000);
        this.music = this.sound.add(GameConstants.Sound.LEVEL2.BSO, {volume: 0.4});
        this.addEventForMusic(this.music,true);
        this.soundLOLO_Bien_lo_hemos_conseguido = this.sound.add(this.TG.getActualLang() + "_" + GameConstants.Sound.LEVELALL.WEDIDIT);
        
        
        //Text Dialog
        this.textDialog = this.add.dynamicBitmapText(30, this.cameras.main.height - 75, GameConstants.Fonts.PIXEL, this.TG.tr('LEVEL2.FINDCLOTHES') + "\n\n" + this.TG.tr('LEVEL2.FINDLEVER'),10 );
        this.textDialog.setScrollFactor(0);
        this.textDialog.setDepth(3);

        

        //Create CaveManClothes
        this.cavemanclothes = this.createEndLevelObject(GameConstants.Sprites.Cavemen_Clothes.KEY);        
        this.physics.world.enable(this.cavemanclothes);
        this.cavemanclothe = this.cavemanclothes[0];
        this.cavemanclothe.setScale(2.75);
        this.cavemanclothe.body.setAllowGravity(false);
        this.anims.play(GameConstants.Anims.CAVEMAN_CLOTHES, this.cavemanclothe);
        
        //Create Joystick
        this.joysticks = this.map.createFromObjects('ActionButton', 'openwall', GameConstants.Sprites.Joystick.KEY);
        this.physics.world.enable(this.joysticks);
        this.joystick = this.joysticks[0];
        this.joystick.setScale(1.5);
        this.joystick.setTexture(GameConstants.Sprites.Joystick.KEY);
        this.joystick.body.setAllowGravity(false);
        //this.anims.play(GameConstants.Anims.JOYSTICK, this.joystick);

        //Create Joystick2
        this.joysticks2 = this.map.createFromObjects('ActionButton2', 'openwall2', GameConstants.Sprites.Joystick.KEY);
        this.physics.world.enable(this.joysticks2);
        this.joystick2 = this.joysticks2[0];
        this.joystick2.setScale(1.5);
        this.joystick2.setTexture(GameConstants.Sprites.Joystick2.KEY);
        this.joystick2.body.setAllowGravity(false);
        //this.anims.play(GameConstants.Anims.JOYSTICK2, this.joystick2);

        //Lava
        let pinchos = this.findTransparentObjects('Pinchos', 'Pinchos', true);
        this.physics.add.overlap(this.daniela, pinchos, () => {
            this.cameras.main.fadeIn(1500);
            this.daniela.body.setVelocity(0, 0);
            this.daniela.x = lastMap.x;
            this.daniela.y = lastMap.y;
        });

        //Wall collider        
        this.physics.add.collider(this.daniela, this.joystick, () => {
            this.joystick.destroy();
            wall.setCollisionByExclusion([0]);
            wall.alpha=0;
        });

        this.physics.add.collider(this.daniela, this.joystick2, () => {
            this.joystick2.destroy();
            wall2.setCollisionByExclusion([0]);
            wall2.alpha=0;
        });

        this.physics.add.collider(this.daniela, this.cavemanclothe, () => {
            this.music.stop();
            this.cavemanclothe.destroy();
            this.soundLOLO_Bien_lo_hemos_conseguido.play();            
            this.daniela.nextScene();
        });

        let climb = this.findTransparentObjects('Climb', 'Climb');
        let climbout = this.findTransparentObjects('Climb', 'ClimbOut');
            
        this.physics.add.overlap(this.daniela, climb, this.climbArea, null, this);
        this.physics.add.overlap(this.daniela, climbout, this.climbAreaOut, null, this);

    }

        //Ladder climbing
    climbArea(daniela, area){     
       
            daniela.x = area.x;
            daniela.body.setAllowGravity(false);
            daniela.isInLiana = true;
            daniela.body.velocity.x = 0;
            daniela.body.velocity.y = 0;
        
    }
    
    //Ladder out
    climbAreaOut(daniela,area){          
            daniela.y -= 10;        
            daniela.isInLiana = false;        
            daniela.body.setAllowGravity(true);
        
    }

    

    update(time, delta) {
        this.daniela.update(time, delta);
        Object.keys(this.enemyGroups).forEach(enemy => {
            this.enemyGroups[enemy].update();
        });
    }
}
export default Level2;