import { Router } from "express";
import { Module } from "./Module";

export interface RestModule extends Module {
  router(): Promise<Router>
}