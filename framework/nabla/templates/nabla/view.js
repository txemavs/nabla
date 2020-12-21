/**
 * Nabla Framework
 * - View: {{view.name}}
 * - Scope: {{view.scope_id}}
 * - Component: {{view.component_id}}
 */

{% if scope %}
// {{view.scope.name}}
function scope(properties=[]) {
  return properties.reduce((computed, name) => {
    computed[name] = {
      get() {
        return this.$store.state.property['{{view.scope_id}}'][name];
      },
      set(value) {
        this.$bus.scope_set('{{view.scope_id}}', name, value)
      }
    }
    return computed
  }, {})
}
{% else %}
// No scope
{% endif %}

const def = {
  name: 'view-{{view.id}}',
  template: `<div ref='view' class='view view-{{view.id}}'>

<!-- {% if view.component %}component "{{view.component.name}}" {% else %}No component{% endif %}-->
{{template|safe}}
{% if view.component %}<!--/component-->{% endif %}
</div>`,

  computed: {
    view() {return {id:"{{view.id}}",name:"{{view.name}}"};},
    scope() {return {% if scope %}{id:"{{view.scope_id}}",name:"{{view.scope.name}}"}{% else %}null{% endif %};},
    {% if view.component %}component() {return {id:"{{view.component.id}}",name:"{{view.component.name}}"};},{% endif %}
    {% if scope %}properties() {return this.$store.state.property['{{view.scope_id}}']},
    ...scope([{{scope|safe }}]),{% endif %}
  },

  mounted() {
    {% if style %}
    var style = document.createElement('style')
    style.innerHTML = `
    {{ style|safe }}`;
    this.$refs.view.appendChild(style)
    {% endif %}
  },

  errorCaptured(err, vm, info) {
    //this.err = err;
    //this.vm = vm;
    //this.info = info;
    console.log("ERROR IN ")
    console.log(err)
    console.log(vm)
    console.log(info)
    return !this.stopPropagation;
  }
}

{{ script|safe }}


