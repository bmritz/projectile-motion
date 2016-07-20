// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author PhET Interactive Simulations
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Trajectory = require( 'PROJECTILE_MOTION/common/model/Trajectory' );
  var Tracer = require( 'PROJECTILE_MOTION/common/model/Tracer' );
  var Score = require( 'PROJECTILE_MOTION/common/model/Score' );

  /**
   * @constructor
   */
  function ProjectileMotionModel() {
    var projectileMotionModel = this;
    PropertySet.call( projectileMotionModel, {

      // TODO: clean up capitalization
      // TODO: add visibility annotations

      // Variables for the next trajectory, and thus the cannon
      // TODO: height --> cannonHeight, cannonAngle, launchVelocity
      // @public
      height: ProjectileMotionConstants.HEIGHT_DEFAULT,
      angle: ProjectileMotionConstants.ANGLE_DEFAULT,
      velocity: ProjectileMotionConstants.VELOCITY_DEFAULT,

      // Parameters for the next projectile fired
      // TODO: rename to projectile
      mass: ProjectileMotionConstants.MASS_DEFAULT, // kg
      diameter: ProjectileMotionConstants.DIAMETER_DEFAULT, // meters
      dragCoefficient: ProjectileMotionConstants.DRAG_COEFFICIENT_DEFAULT,

      // Properties that change the environment and affect all projectiles immediately
      altitude: ProjectileMotionConstants.ALTITUDE_DEFAULT,
      airResistanceOn: ProjectileMotionConstants.AIR_RESISTANCE_ON_DEFAULT, // should default to false

      // Vectors
      velocityVectorComponentsOn: false,

      // Measuring Tape (in common code)
      // TODO: measuringTapeVisible
      units: { name: 'meters', multiplier: 1 }, // for common code measuringtape
      measuringTape: true,
      // TODO: make Vector2 for basePositionProperty
      measuringTapeX: ProjectileMotionConstants.TAPE_MEASURE_X_DEFAULT,
      measuringTapeY: ProjectileMotionConstants.TAPE_MEASURE_Y_DEFAULT,

      // animation controls, e.g. normal/slow/play/pause/step
      speed: 'normal',
      isPlaying: true
    } );

    // TODO: rename stepCount?
    this.stepThree = 0; // @private, how many steps mod three, used to slow animation down to a third of normal speed
   
    // observable array of trajectories
    projectileMotionModel.trajectories = new ObservableArray();

    // TODO: move functions into inherit

    // @private, adds a trajectory to the observable array
    projectileMotionModel.addTrajectory = function() {
      projectileMotionModel.trajectories.push( new Trajectory( projectileMotionModel ) );
    };

    // scoring handler
    projectileMotionModel.scoreModel = new Score( ProjectileMotionConstants.TARGET_X_DEFAULT );

    // called on when fire button is pressed
    projectileMotionModel.cannonFired = function() {
      projectileMotionModel.isPlaying = true;
      projectileMotionModel.addTrajectory();
      projectileMotionModel.scoreModel.turnOffScore();
    };

    // model for the tracer probe
    projectileMotionModel.tracerModel = new Tracer( projectileMotionModel.trajectories, 10, 10 ); // location arbitrary
  }

  projectileMotion.register( 'ProjectileMotionModel', ProjectileMotionModel );

  return inherit( PropertySet, ProjectileMotionModel, {

    reset: function() {
      // reset all properties by calling super class
      PropertySet.prototype.reset.call( this );

      // remove all trajectories
      this.trajectories.reset();

      this.scoreModel.reset();

      this.tracerModel.reset();
    },

    // @public animates trajectory if running
    step: function( dt ) {

      //TODO: why?
      this.stepThree += 1;
      this.stepThree = this.stepThree % 3;

      // prevent sudden dt bursts when the user comes back to the tab after a while
      dt = Math.min( 0.064, dt );

      if ( this.isPlaying ) {
        // either this speed is normal, or its slow and only steps on every third frame
        // TODO: revert back to one second = one third of a second
        if ( this.speed === 'normal' || this.stepThree === 0 ) {
          this.stepInternal(  dt );
        }
      }
    },

    // TODO: public, rename to stepModelElements
    stepInternal: function( dt ) {
      this.trajectories.forEach( function( trajectory ) { trajectory.step( dt ); } );
      this.scoreModel.step( dt );
    }
  } );
} );

