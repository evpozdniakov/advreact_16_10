import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

class Submenu extends Component {
  render() {
    return (
      <nav className="submenu">
        {this.props.links.map(this.renderSubmenuItem.bind(this))}
      </nav>
    )
  }

  renderSubmenuItem(item, index) {
    const { to, title } = item

    const props = {
      key: index,
      activeClassName: 'active',
      to,
    }

    return (
      <NavLink {...props}>
        {title}
      </NavLink>
    )
  }
}

export default Submenu
