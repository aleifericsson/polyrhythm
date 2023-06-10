const canvas = document.querySelector('#draw');
const pencil = canvas.getContext('2d');

function start(){
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    pencil.strokeStyle = "black";
    pencil.lineWidth = 4;
    def_circs(15);
}

const start_crd = {
    x:canvas.width*0.1,
    y:canvas.height*0.5
};

const end_crd = {
    x:canvas.width*0.9,
    y:canvas.height*0.5
};

const mid_crd = {
    x:canvas.width *0.5,
    y:canvas.width*0.5
};

const base_len = end_crd.x - start_crd.x;

function draw_base(){
    pencil.strokeStyle = "black";
    pencil.beginPath();
    pencil.moveTo(start_crd.x,start_crd.y);
    pencil.lineTo(end_crd.x,end_crd.y);
    pencil.stroke();
}

function draw_arc(col,rad){
    pencil.strokeStyle=col;
    pencil.beginPath();
    pencil.arc(mid_crd.x,mid_crd.y,rad,Math.PI,Math.PI*2);
    pencil.stroke();
}

function draw_circ(time,vel,rad_loc){ //number from 0 to 1
    const max_ang = 2*Math.PI;
    const arc_rad = rad_loc;
    const raw_ang = (Math.PI + (time*vel))%max_ang;//basically goes from pi to 3pi and then resets to 0
    let adj_ang;
    if (raw_ang<= Math.PI){//flips it if its neg itspos
        adj_ang = max_ang-raw_ang;
    } else{
        adj_ang = raw_ang;
    }
    const circ_x = mid_crd.x+arc_rad*Math.cos(adj_ang); //unit vectors wow!!
    const circ_y = mid_crd.y+arc_rad*Math.sin(adj_ang);
    pencil.fillStyle="black";
    pencil.beginPath();
    pencil.arc(circ_x,circ_y,base_len*0.01,0,Math.PI*2);
    pencil.fill();
}

let start_time = new Date().getTime();

function get_time(){
    let current_time= new Date().getTime();    
    return (current_time-start_time)/1000;
}

function calc_next_impact(cur_time,vel){
    return cur_time+(Math.PI/vel)*1000;
}

function act(){
    pencil.clearRect(0,0,canvas.width,canvas.height);    
    circs.forEach((circ) =>{
        draw_arc(circ.arc_rgb,circ.rad_loc);
        draw_circ(get_time(),circ.vel,circ.rad_loc);
        cur_time = new Date().getTime();
        if (cur_time >= circ.next_impact){
            if(soundEnabled){
                circ.aud_file.play();
            }
            circ.next_impact = calc_next_impact(circ.next_impact,circ.vel)
        }
    });
    draw_base();
    requestAnimationFrame(act);
}

let circs = [];
let soundEnabled = false;
document.onvisibilitychange = () => soundEnabled = false;
canvas.onclick = () => soundEnabled = !soundEnabled;

function def_circs(num){
    let green_val = 0;
    let init_rad = base_len*0.05;
    let step = ((base_len-init_rad)/2)/num;
    let duration = 300; //in secs
    let init_loops = 40;
    for (let i = 0; i < num; i++){
        audio = new Audio(`poly-sounds/${(i%5)+1}.wav`);
        audio.volume = 0.03;
        let loop_num = (2*Math.PI*(init_loops-i))
        circs.push({
            arc_rgb:`rgb(150,${green_val},250)`,
            vel:loop_num/duration,
            rad_loc:init_rad + (i*step),
            aud_file:audio,
            next_impact:calc_next_impact(start_time,loop_num/duration)
        });
        green_val = green_val+Math.floor((200/num));   
    }
}

start();
act();



