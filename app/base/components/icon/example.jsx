/** @jsx React.DOM */

var React = require('react');
var _ = require('lodash');

var Icon = require('./');

require('./example.scss');

var fontIcons = [
  'action-redo',
  'action-undo',
  'anchor',
  'arrow-down',
  'arrow-left',
  'arrow-right',
  'arrow-up',
  'badge',
  'bag',
  'ban',
  'bar-chart',
  'basket',
  'basket-loaded',
  'bell',
  'book-open',
  'briefcase',
  'bubble',
  'bubbles',
  'bulb',
  'calculator',
  'calendar',
  'call-end',
  'call-in',
  'call-out',
  'camcorder',
  'camera',
  'check',
  'chemistry',
  'clock',
  'close',
  'cloud-download',
  'cloud-upload',
  'compass',
  'control-end',
  'control-forward',
  'control-pause',
  'control-play',
  'control-rewind',
  'control-start',
  'credit-card',
  'crop',
  'cup',
  'cursor',
  'cursor-move',
  'diamond',
  'direction',
  'directions',
  'disc',
  'dislike',
  'doc',
  'docs',
  'drawer',
  'drop',
  'earphones',
  'earphones-alt',
  'emoticon-smile',
  'energy',
  'envelope',
  'envelope-letter',
  'envelope-open',
  'equalizer',
  'eye',
  'eyeglasses',
  'feed',
  'film',
  'fire',
  'flag',
  'folder',
  'folder-alt',
  'frame',
  'game-controller',
  'ghost',
  'globe',
  'globe-alt',
  'graduation',
  'graph',
  'grid',
  'handbag',
  'heart',
  'home',
  'hourglass',
  'info',
  'key',
  'layers',
  'like',
  'link',
  'list',
  'lock',
  'lock-open',
  'login',
  'logout',
  'loop',
  'magic-wand',
  'magnet',
  'magnifier',
  'magnifier-add',
  'magnifier-remove',
  'map',
  'microphone',
  'mouse',
  'moustache',
  'music-tone',
  'music-tone-alt',
  'note',
  'notebook',
  'paper-clip',
  'paper-plane',
  'pencil',
  'picture',
  'pie-chart',
  'pin',
  'plane',
  'playlist',
  'plus',
  'pointer',
  'power',
  'present',
  'printer',
  'puzzle',
  'question',
  'refresh',
  'reload',
  'rocket',
  'screen-desktop',
  'screen-smartphone',
  'screen-tablet',
  'settings',
  'share',
  'share-alt',
  'shield',
  'shuffle',
  'size-actual',
  'size-fullscreen',
  'social-dribbble',
  'social-dropbox',
  'social-facebook',
  'social-tumblr',
  'social-twitter',
  'social-youtube',
  'speech',
  'speedometer',
  'star',
  'support',
  'symbol-female',
  'symbol-male',
  'tag',
  'target',
  'trash',
  'trophy',
  'umbrella',
  'user',
  'user-female',
  'user-follow',
  'user-following',
  'user-unfollow',
  'users',
  'vector',
  'volume-1',
  'volume-2',
  'volume-off',
  'wallet',
  'wrench',
];

var svgIcons = require.context('./svgs', true, /\.svg$/).keys().map(function(name) {
  return name.replace(/.\/icon-/i, '').replace(/.svg$/i, '');
}).sort();

var commonIcons = _.intersection(fontIcons, svgIcons);

fontIcons = _.difference(fontIcons, commonIcons);

var IconExample = React.createClass({
  render: function() {
    var svgContent;
    if (svgIcons.length > 0) {
      svgContent = (
        <div>
          <h3>SVG-based</h3>
          <ul className="IconExample">
            {svgIcons.map(function(iconName) {
              return (<li>
                <Icon className="IconExample--large" type={iconName} font={false} /><Icon type={iconName} font={false} /><code>{iconName}</code>
              </li>);
            })}
          </ul>
        </div>
      );
    }

    var fontContent;
    if (fontIcons.length > 0) {
      fontContent = (
        <div>
          <h3>Font-based Only</h3>
          <p>These icons either need to be migrated to SVG, or considered deprecated.</p>
          <ul className="IconExample">
            {fontIcons.map(function(iconName) {
              return (<li>
                <Icon className="IconExample--large" type={iconName} /><Icon type={iconName} /><code>{iconName}</code>
              </li>);
            })}
          </ul>
        </div>
      );
    }

    var commonContent;
    if (commonIcons.length > 0) {
      commonContent = (
        <div>
          <h3>Font-based Duplicates</h3>
          <p>These icons are included as SVGs, and use as fonts is considered deprecated.</p>
          <ul className="IconExample">
            {commonIcons.map(function(iconName) {
              return (<li>
                <Icon type={iconName} /><code>{iconName}</code>
              </li>);
            })}
          </ul>
        </div>
      );
    }

    return (
      <div>
        {svgContent}
        {fontContent}
        {commonContent}
      </div>
    );
  }
});

module.exports = IconExample;
