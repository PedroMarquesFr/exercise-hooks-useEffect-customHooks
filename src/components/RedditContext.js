import React, { useState, createContext, useEffect } from "react";
import PropTypes from "prop-types";

import { getPostsBySubreddit } from "../services/redditAPI";

const Context = createContext();
const { Provider, Consumer } = Context;

function RedditProvider({ children }) {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     postsBySubreddit: {
  //       frontend: {},
  //       reactjs: {},
  //     },
  //     selectedSubreddit: 'reactjs',
  //     shouldRefreshSubreddit: false,
  //     isFetching: false,
  //   };

  //   this.fetchPosts = this.fetchPosts.bind(this);
  //   this.shouldFetchPosts = this.shouldFetchPosts.bind(this);
  //   this.handleFetchSuccess = this.handleFetchSuccess.bind(this);
  //   this.handleFetchError = this.handleFetchError.bind(this);
  //   this.handleSubredditChange = this.handleSubredditChange.bind(this);
  //   this.handleRefreshSubreddit = this.handleRefreshSubreddit.bind(this);
  // }
  const [postsBySubreddit, setPostsBySubreddit] = useState({
    frontend: {},
    reactjs: {},
  });
  const [selectedSubreddit, setSelectedSubreddit] = useState("reactjs");
  const [shouldRefreshSubreddit, setShouldRefreshSubreddit] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // componentDidUpdate(_prevProps, prevState) {
  //   const { state } = this;
  //   const { shouldRefreshSubreddit } = state;
  //   const selectedSubredditChanged = prevState.selectedSubreddit !== state.selectedSubreddit;

  //   if (selectedSubredditChanged || shouldRefreshSubreddit) {
  //     this.fetchPosts();
  //   }
  // }
  useEffect(() => {
    // const selectedSubredditChanged = prevState.selectedSubreddit !== state.selectedSubreddit;

    // if (selectedSubredditChanged || shouldRefreshSubreddit) {
    fetchPosts();
    // }
  },[selectedSubreddit]);

  const fetchPosts = () => {
    if (!shouldFetchPosts()) return;

    setShouldRefreshSubreddit(false);
    setIsFetching(true);

    getPostsBySubreddit(selectedSubreddit).then(
      handleFetchSuccess,
      handleFetchError
    );
  };

  const shouldFetchPosts = () => {
    const posts = postsBySubreddit[selectedSubreddit];

    if (!posts.items) return true;
    if (isFetching) return false;
    return shouldRefreshSubreddit;
  };

  const handleFetchSuccess = (json) => {
    const lastUpdated = Date.now();
    const items = json.data.children.map((child) => child.data);

    setShouldRefreshSubreddit(false);
    setIsFetching(false);
    setPostsBySubreddit({ ...postsBySubreddit, [selectedSubreddit]:{items, lastUpdated} });
  };

  const handleFetchError = (error) => {
    setShouldRefreshSubreddit(false);
    setIsFetching(false);
    setPostsBySubreddit({ ...postsBySubreddit, items:[], error: error.message });
  };

  const handleSubredditChange = (selectedSubreddit) => {
    setSelectedSubreddit(selectedSubreddit);
  };

  const handleRefreshSubreddit = () => {
    setShouldRefreshSubreddit(true);
  };

  const context = {
    postsBySubreddit,
    selectedSubreddit,
    shouldRefreshSubreddit,
    isFetching,
    selectSubreddit: handleSubredditChange,
    fetchPosts: fetchPosts,
    refreshSubreddit: handleRefreshSubreddit,
    availableSubreddits: Object.keys(postsBySubreddit),
    posts: postsBySubreddit[selectedSubreddit].items,
  };

  return <Provider value={context}>{children}</Provider>;
}

RedditProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { RedditProvider as Provider, Consumer, Context };
