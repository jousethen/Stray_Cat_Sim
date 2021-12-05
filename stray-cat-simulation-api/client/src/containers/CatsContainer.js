import React, { Component } from 'react';
import { connect } from "react-redux";
import { fetchTodaysCats } from '../actions/cat_actions';
import CatCard from '../components/CatCard';
import Footer from '../components/Footer';
import { Modal } from 'react-bootstrap';
import cuid from 'cuid';
export const cuidFn = cuid;

class CatsContainer extends Component {
  constructor() {
    super();
    this.state = {
      showModal: false
    }
  }
  componentDidMount() {
    //Fetch All cats
    this.props.fetchTodaysCats();
  }

  renderCatCards = () => {
    return this.props.cats.map((cat) => { return (<CatCard cat={cat} key={cuidFn()} handleActionClick={this.handleActionClick} />) })
  }


  hideModal = () => {
    this.setState({
      showModal: false
    })
  }

  handleActionClick = (catId, action) => {

    if (this.props.actions > 0) {
      switch (action) {
        case "feed": this.props.feedCat(catId);
          break;
        case "heal": this.props.healCat(catId);
          break;
        case "pet": this.props.petCat(catId);
          break;
        case "rename":
          let newName = prompt("Name Your Friend:", "");
          this.props.renameCat(catId, newName);
          break;
        default:
      }

      this.props.useAction();
    }
    else {
      this.setState({
        showModal: true
      })
    }

  }

  render() {
    if (this.props.cats.length > 0) {
      return (
        <div className="cats-container">
          {this.props.actions}{this.renderCatCards()}
          <Modal
            size="sm"
            show={this.state.showModal}
            onHide={() => this.hideModal()}
            aria-labelledby="example-modal-sizes-title-sm"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-sm">
                No Actions Left for Today
              </Modal.Title>
            </Modal.Header>
          </Modal>
          <Footer />
        </div>
      )
    }
    else {
      return (
        <div className="cats-container">
          NO CATS
          <Footer />
        </div>
      )
    }
  }
}


const mapStateToProps = (state) => {
  return {
    cats: state.cats.cats,
    loading: state.cats.loading,
    actions: state.user.actions
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTodaysCats: () => {
      dispatch(fetchTodaysCats());
    },

    feedCat: (catId) => {
      dispatch({ type: "FEED_CAT", catId })
    },

    healCat: (catId) => {
      dispatch({ type: "HEAL_CAT", catId })
    },

    petCat: (catId) => {
      dispatch({ type: "PET_CAT", catId })
    },

    renameCat: (catId, name) => {
      dispatch({ type: "RENAME_CAT", catId, name })
    },


    useAction: () => {
      dispatch({ type: "USE_ACTION" })
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(CatsContainer)
