// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author PhET Interactive Simulations
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionModel = require( 'PROJECTILE_MOTION/common/model/ProjectileMotionModel' );
  var ProjectileObjectType = require( 'PROJECTILE_MOTION/common/model/ProjectileObjectType' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   */
  function ProjectileMotionIntroModel() {
    var self = this;
    ProjectileMotionModel.call( self );

    this.objectTypes = [
      ProjectileObjectType.CANNONBALL,
      ProjectileObjectType.TANK_SHELL,
      ProjectileObjectType.PUMPKIN
    ];

    this.selectedProjectileObjectTypeProperty = new Property( this.objectTypes[ 0 ] );

    this.selectedProjectileObjectTypeProperty.link( function( selectedProjectileObjectType ) {
      self.projectileMassProperty.set( selectedProjectileObjectType.mass );
      self.projectileDiameterProperty.set( selectedProjectileObjectType.diameter );
      self.projectileDragCoefficientProperty.set( selectedProjectileObjectType.dragCoefficient );
    } );
  }

  projectileMotion.register( 'ProjectileMotionIntroModel', ProjectileMotionIntroModel );

  return inherit( ProjectileMotionModel, ProjectileMotionIntroModel );
} );

