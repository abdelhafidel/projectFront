package com.applicationWs;

import java.util.List;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.websocket.server.PathParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.google.gson.Gson;
import com.project.dao.IphoneLocal;
import com.project.dao.IpositionLocal;
import com.project.dao.IuserLocal;
import com.project.modal.Position;
import com.project.modal.Smartphone;

@Stateless
@Path("/smartphone")
public class CompteWebService {


	@POST
	@Path(value = "/getSmart/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public String test(@PathParam(value = "id") String id) {
		System.out.println("------------------"+id);
		
		return id;
	}
	
	@EJB
	private IphoneLocal service;
	
	@EJB
	private IpositionLocal position;
	
	@EJB
	private IuserLocal user;

	@POST
	@Path("/get")
	@Produces(MediaType.APPLICATION_JSON)
	public Smartphone getSmartphone(@PathParam(value = "imei") String imei) {
		
		return service.findByEmei(imei);
	}
	
	@POST
	@Path("/getAll")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Smartphone> getSmartphone() {
		
		return service.findAll();
	}
	
	@POST
	@Path("/getPhones")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Smartphone> getSmartphones(@PathParam(value = "nom") String nom) {
		
		return user.findAllSmartphoneByUser(nom);
	}
	
	@POST
	@Path("/savePosition")
	@Consumes("application/json")
	@Produces(MediaType.APPLICATION_JSON)
	public void addPosition(String request) {
		
		Gson g = new Gson();
		Position o = g.fromJson(request, Position.class);
		
		Position p = o;
		Smartphone s = new Smartphone();
		
		s.setId(o.getId());
		p.setSmartphone(service.findById(s));
		p.setId(0l);
		position.create(p);

	}
}
