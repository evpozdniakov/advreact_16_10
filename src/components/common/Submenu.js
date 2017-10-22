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

  renderSubmenuItem(item) {
    const { to, title } = item

    return (
      <NavLink to={to} activeClassName="active">
        {title}
      </NavLink>
    )
  }
}

export default Submenu
