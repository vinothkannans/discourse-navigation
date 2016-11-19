import MenuLink from 'discourse/plugins/navigation/discourse/models/menu-link';
import { bufferedProperty } from 'discourse/mixins/buffered-content';
import { popupAjaxError } from 'discourse/lib/ajax-error';
import { propertyEqual } from 'discourse/lib/computed';

export default Ember.Component.extend(bufferedProperty('menuLink'), {
  editing: Ember.computed.empty('menuLink.id'),
  classNameBindings: [':menu-link'],

  cantMoveUp: propertyEqual('menuLink', 'firstField'),
  cantMoveDown: propertyEqual('menuLink', 'lastField'),

  flags: function() {
    const ret = [];
    if (this.get('menuLink.visible')) {
      if (this.get('menuLink.visible.main')) {
        ret.push(I18n.t('admin.menu_links.enabled.main'));
      }
      if (this.get('menuLink.visible.hamburger_general')) {
        ret.push(I18n.t('admin.menu_links.enabled.hamburger.general'));
      }
      if (this.get('menuLink.visible.hamburger_footer')) {
        ret.push(I18n.t('admin.menu_links.enabled.hamburger.footer'));
      }
    }

    return ret.join(', ');
  }.property('menuLink.visible.main', 'menuLink.visible.hamburger_general', 'menuLink.visible.hamburger_footer'),

  actions: {
    save() {
      const self = this;
      const buffered = this.get('buffered');
      const attrs = buffered.getProperties('name',
                                         'url',
                                         'visible.main',
                                         'visible.hamburger_general',
                                         'visible.hamburger_footer');

      this.get('menuLink').save(attrs).then(function() {
        self.set('editing', false);
        self.commitBuffer();
      }).catch(popupAjaxError);
    },

    moveUp() {
      this.sendAction('moveUpAction', this.get('menuLink'));
    },

    moveDown() {
      this.sendAction('moveDownAction', this.get('menuLink'));
    },

    edit() {
      this.set('editing', true);
    },

    destroy() {
      this.sendAction('destroyAction', this.get('menuLink'));
    },

    cancel() {
      const id = this.get('menuLink.id');
      if (Ember.isEmpty(id)) {
        this.sendAction('destroyAction', this.get('menuLink'));
      } else {
        this.rollbackBuffer();
        this.set('editing', false);
      }
    }
  }
});
