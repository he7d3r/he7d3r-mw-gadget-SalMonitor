/**
 * Generates a table showing the scores for each revision returned from Quary
 *
 * @author: Helder (https://github.com/he7d3r)
 * @license: CC BY-SA 3.0 <https://creativecommons.org/licenses/by-sa/3.0/>
 */
( function ( mw, $ ) {
	'use strict';

    function salMonitor() {
      $.ajax( {
            url: 'https://wikitech.wikimedia.org/w/api.php',
            data: {
                action: 'query',
                formatversion: 2,
                prop: 'revisions',
                format: 'json',
                rvprop: 'content',
                rvsection: 2, // Current day only
                titles: 'Server Admin Log'
            },
            dataType: 'jsonp'
        } ).done( function ( data ) {
            var text = data.query.pages[ 0 ].revisions[ 0 ].content,
                key;
            $.each( text.split( '\n' ), function ( n, text ) {
                if ( mw.config.get( 'server-admin-log-regex' ).test( text ) ) {
                    key = '-s-a-log-' + text.substring( 0, 20 );
                    if ( mw.cookie.get( key ) !== '1' ) {
                        mw.notify( text );
                        mw.cookie.set(
                            key,
                            '1',
                            {
                                // 24 hours
                                expires: 86400
                            }
                        );
                    }
                }
            } );
        } );
    }

    if ( mw.config.get( 'wgCanonicalSpecialPageName' ) === 'Watchlist' ) {
        mw.loader.using( [ 'mediawiki.cookie', 'mediawiki.notify' ] ).done( salMonitor );
    }

}( mediaWiki, jQuery ) );
