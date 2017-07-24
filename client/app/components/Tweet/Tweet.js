import React from 'react'
import PropTypes from 'prop-types'
import Context from './Context'
import Header from './Header'
import Text from './Text'
import Media from './Media'
import Modal from './Modal'
import Quote from './Quote'
import Footer from './Footer'
import styles from './styles'

class Tweet extends React.Component {
  constructor (props) {
    super(props)
    this.toggleModal = this.toggleModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.state = {
      'modalActive': false,
      'modalIndex': 0
    }
  }

  toggleModal (idx) {
    this.setState({
      'modalActive': true,
      'modalIndex': idx
    })
  }

  closeModal () {
    this.setState({
      'modalActive': false
    })
  }

  getChildContext () {
    return {
      'toggleModal': this.toggleModal,
      'closeModal': this.closeModal
    }
  }

  render () {
    const {modalActive, modalIndex} = this.state
    let {data} = this.props, isRT = false
    let MediaComponent = null, QuoteComponent = null
    const { diseableFooterLink } = this.props;

    // use retweet as data if its a RT
    if (data.retweeted_status) {
      data = data.retweeted_status
      isRT = true
    }

    // use Media component if media entities exist
    if (data.entities && data.entities.media) {
      MediaComponent = <Media media={data.entities.media} />
    }

    // extended_entities override, these are multi images, videos, gifs
    if (data.extended_entities && data.extended_entities.media) {
      MediaComponent = <Media media={data.extended_entities.media} />
    }

    // use Quote component if quoted status exists
    if (data.quoted_status) {
      QuoteComponent = <Quote data={data.quoted_status} />
    }

    return (
      <div className="tweet" style={styles.tweet}>
        {isRT ? <Context {... this.props} /> : null}
        <div className="content" style={styles.content}>
          <Header data={data} />
          <Text data={data} />
          {MediaComponent}
          {QuoteComponent}
          <Footer data={data} diseableFooterLink={diseableFooterLink} />
        </div>
        {modalActive ? <Modal data={data} modalIndex={modalIndex} /> : null}
      </div>
    )
  }
}

Tweet.childContextTypes = {
  'toggleModal': PropTypes.func,
  'closeModal': PropTypes.func
}

Tweet.propTypes = {
  'data': PropTypes.object,
  'diseableFooterLink': PropTypes.bool
}

Tweet.defaultProps = {
  'data': {
    'entities': {},
    'user': {}
  },
  'diseableFooterLink': false
}

export default Tweet