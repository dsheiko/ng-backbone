/// <reference path="../src/core.d.ts" />
import { FormStateSpec } from "./spec/formstate.spec";
import { ViewSpec } from "./spec/view.spec";
import { FormViewSpec } from "./spec/formview.spec";
import UtilsSpec from "./spec/utils.spec";
import CollectionSpec from "./spec/collection.spec";

UtilsSpec();
FormStateSpec();
ViewSpec();
FormViewSpec();

CollectionSpec();