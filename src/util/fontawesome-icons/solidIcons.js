import { library } from "@fortawesome/fontawesome-svg-core";

import {
  faTrash,
  faSignOut,
  faEdit,
  faSpinner,
  faPhone,
  faEnvelope,
  faMapMarkedAlt,
  faLock,
  faEye,
  faEyeSlash,
  faChevronUp,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faUser,
  faCheck,
  faBars,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

const solidIcons = () => {
  return library.add(
    faTrash,
    faSignOut,
    faEdit,
    faSpinner,
    faPhone,
    faEnvelope,
    faMapMarkedAlt,
    faLock,
    faEye,
    faEyeSlash,
    faChevronUp,
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faUser,
    faCheck,
    faBars,
    faPlus,
    faMinus
  );
};

export default solidIcons;
