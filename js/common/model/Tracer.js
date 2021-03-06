// Copyright 2016, University of Colorado Boulder

/**
 * Model for the tracer tool. Knows about projectiles, which contain arrays of points on their projectiles.
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );
  
  // constants
  var SENSING_RADIUS = 0.2; // meters, will change to view units. How close the tracer needs to get to a datapoint


  /**
   * @param {ObservableArray.<Projectile>} projectiles
   * @constructor
   */
  function Tracer( projectiles, tracerX, tracerY ) {
    // @public
    PropertySet.call( this, {
      position: new Vector2( tracerX, tracerY ),
      point: null,

      // @public - Whether the measuring tape is out in the play area (false when in the toolbox)
      isActive: false
    } );

    // @public {ObservableArray.<Trajectory>} array of projectiles in the model
    this.projectiles = projectiles;
  }

  projectileMotion.register( 'Tracer', Tracer );

  return inherit( PropertySet, Tracer, {

    // @private checks for if there is a point the tracer is close to
    // @returns {DataPoint|null}
    checkForPoint: function() {
      var i;
      for ( i = this.projectiles.length - 1; i >= 0; i-- ) {
        var currentTrajectory = this.projectiles.get( i );
        var point = currentTrajectory.getNearestPoint( this.position.x, this.position.y );
        if ( point && point.distance( this.position ) <= SENSING_RADIUS ) {
          this.pointProperty.set( point );
          return;
        }
      }
      this.pointProperty.set( null );
    },

    // @public updates time, range, and height
    updateData: function() {
      this.checkForPoint();
    }
  } );

} );

