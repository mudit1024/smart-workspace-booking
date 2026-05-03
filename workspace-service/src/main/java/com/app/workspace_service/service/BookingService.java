package com.app.workspace_service.service;

import com.app.workspace_service.dto.BookingResponse;
import com.app.workspace_service.dto.MyBookingResponse;
import com.app.workspace_service.entity.Booking;

import java.util.List;

public interface BookingService {

    List<MyBookingResponse> getMyBookings(String userId);
}
