import { Component, OnDestroy, ViewChild, ElementRef, AfterViewInit, NgZone, Renderer2 } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as THREE from 'three';

@Component({
  moduleId: module.id,
  selector: 'my-app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  animations: [
    trigger('intro', [
      state('void', style({
        opacity: '0.0',
        transform: 'translateZ(-1000px)'
      })),
      state('active', style({
        opacity: '1.0',
        transform: 'translateZ(0px)',
        perspective: '1000px'
      })),
      state('inactive',   style({
        opacity: '0.0',
        transform: 'translateZ(-1000px)',
        perspective: '1000px'
      })),
      transition('active => void', animate('5000ms cubic-bezier(0.19, 1, 0.22, 1)')),
      transition('void => active', animate('5000ms cubic-bezier(0.19, 1, 0.22, 1)')),
      transition('inactive => active', animate('5000ms cubic-bezier(0.19, 1, 0.22, 1)')),
      transition('active => inactive', animate('5000ms cubic-bezier(0.19, 1, 0.22, 1)'))
    ])
  ]
})

export class HomeComponent implements AfterViewInit {

  animationState: string;
  cube: THREE.Mesh;
  glRenderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;

  private get canvas() : HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  @ViewChild('canvas') canvasRef: ElementRef;

  constructor(private renderer : Renderer2,
              private ngZone: NgZone) {
                 this.animationState = 'active';
              }

  makeScene() {

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, this.canvas.clientWidth / this.canvas.clientHeight, 1, 1000);
    this.camera.position.z = 40;

    this.glRenderer = new THREE.WebGLRenderer({ canvas: this.canvas });

  }

  makeCube() {

    let geometry = new THREE.BoxBufferGeometry(12, 12, 12);
    let material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );

    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

  }

  render() {

    this.cube.rotation.y += 0.01; //TODO: Figure out if we can read state from Animations API here in 4.1

    this.glRenderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.glRenderer.render(this.scene, this.camera);

    requestAnimationFrame(() => this.render()); // TODO: Is this best practice or should we get frames from Animations API?

  }


  ngAfterViewInit() {

    this.makeScene();
    this.makeCube();
    this.ngZone.runOutsideAngular(() => this.render());


  }

}
